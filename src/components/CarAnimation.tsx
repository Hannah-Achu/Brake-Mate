import { useEffect, useRef } from 'react';
import { AnimationState } from '../types/brake-types';

interface CarAnimationProps {
  animationState: AnimationState;
  buildProgress: number;
}

export default function CarAnimation({ animationState, buildProgress }: CarAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const baseY = height / 2 + 60;
    const carLength = 240;
    const carHeight = 80;

    let offsetX = 0;
    let tilt = 0;

    if (animationState.status === 'failed') {
      if (animationState.failureType === 'sliding') {
        offsetX = Math.sin(Date.now() / 200) * 15;
      } else if (animationState.failureType === 'tilting') {
        tilt = Math.sin(Date.now() / 300) * 0.1;
      }
    }

    ctx.save();
    ctx.translate(centerX + offsetX, baseY);
    ctx.rotate(tilt);

    if (buildProgress > 0.1) {
      const wheelRadius = 30;
      const wheelY = carHeight / 2 + 10;
      const wheelOpacity = Math.min((buildProgress - 0.1) / 0.2, 1);

      ctx.globalAlpha = wheelOpacity;

      [-carLength / 2 + 40, carLength / 2 - 40].forEach((wheelX) => {
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wheelX, wheelY, wheelRadius - 8, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
    }

    if (buildProgress > 0.3) {
      const caliperOpacity = Math.min((buildProgress - 0.3) / 0.2, 1);
      ctx.globalAlpha = caliperOpacity;

      [-carLength / 2 + 40, carLength / 2 - 40].forEach((caliperX) => {
        ctx.fillStyle = animationState.status === 'failed' ? '#ef4444' : '#3b82f6';
        ctx.fillRect(caliperX - 15, carHeight / 2 - 10, 30, 40);

        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
        ctx.strokeRect(caliperX - 15, carHeight / 2 - 10, 30, 40);
      });

      ctx.globalAlpha = 1;
    }

    if (buildProgress > 0.5) {
      const bodyOpacity = Math.min((buildProgress - 0.5) / 0.3, 1);
      ctx.globalAlpha = bodyOpacity;

      const gradient = ctx.createLinearGradient(0, -carHeight, 0, carHeight / 2);
      if (animationState.status === 'complete') {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
      } else if (animationState.status === 'failed') {
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(1, '#b91c1c');
      } else {
        gradient.addColorStop(0, '#6b7280');
        gradient.addColorStop(1, '#4b5563');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-carLength / 2 + 20, carHeight / 2);
      ctx.lineTo(-carLength / 2, 0);
      ctx.lineTo(-carLength / 2 + 40, -carHeight + 10);
      ctx.lineTo(carLength / 2 - 40, -carHeight + 10);
      ctx.lineTo(carLength / 2, 0);
      ctx.lineTo(carLength / 2 - 20, carHeight / 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-carLength / 2 + 50, -carHeight + 15, 60, 35);
      ctx.fillRect(carLength / 2 - 110, -carHeight + 15, 60, 35);

      ctx.globalAlpha = 1;
    }

    if (buildProgress > 0.8 && animationState.status === 'failed') {
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 200) * 0.4;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', 0, -carHeight - 20);
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    if (animationState.status === 'complete' && buildProgress >= 1) {
      const brakingAnimation = (Date.now() % 3000) / 3000;
      if (brakingAnimation < 0.5) {
        const brakeProgress = brakingAnimation * 2;
        const carX = centerX - (brakeProgress * 150);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(carX - carLength / 2 - 20, baseY - 10, 30, 5);
        ctx.fillRect(carX + carLength / 2 - 10, baseY - 10, 30, 5);
      }
    }

  }, [animationState, buildProgress]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Simulation</h3>
      <div className="relative bg-gradient-to-b from-sky-100 to-gray-100 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white bg-opacity-90 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Build Progress</span>
              <span className="text-sm font-semibold text-gray-900">{Math.round(buildProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  animationState.status === 'complete'
                    ? 'bg-green-500'
                    : animationState.status === 'failed'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${buildProgress * 100}%` }}
              />
            </div>
            {animationState.status === 'failed' && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                {animationState.failureType === 'sliding' && 'Wheels locking - excessive deceleration!'}
                {animationState.failureType === 'tilting' && 'Unstable braking!'}
                {animationState.failureType === 'insufficient-braking' && 'Insufficient braking force!'}
              </p>
            )}
            {animationState.status === 'complete' && buildProgress >= 1 && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Braking system optimal - safe operation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

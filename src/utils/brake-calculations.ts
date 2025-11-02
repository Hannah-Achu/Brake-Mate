import { VehicleInputs, BrakeResults, ValidationWarning } from '../types/brake-types';

export function calculateBrakingPerformance(inputs: VehicleInputs): BrakeResults {
  const pistonArea = Math.PI * Math.pow(inputs.pistonDiameter / 2000, 2);

  const clampingForce = inputs.brakeLinePressure * 1000 * pistonArea;

  const frictionForce = clampingForce * inputs.frictionCoefficient;

  const torquePerWheel = frictionForce * (inputs.effectiveBrakeRadius / 1000) * inputs.mechanicalAdvantage;

  const totalBrakingTorque = torquePerWheel * 4;

  const brakingForce = totalBrakingTorque / (inputs.tireRadius / 1000);

  const deceleration = brakingForce / inputs.vehicleMass;

  const initialSpeedMs = inputs.initialSpeed / 3.6;
  const stoppingDistance = Math.pow(initialSpeedMs, 2) / (2 * deceleration);
  const stoppingTime = initialSpeedMs / deceleration;

  return {
    torquePerWheel,
    totalBrakingTorque,
    brakingForce,
    deceleration,
    stoppingDistance,
    stoppingTime,
  };
}

export function validateInputs(inputs: VehicleInputs): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (inputs.vehicleMass < 50 || inputs.vehicleMass > 2000) {
    warnings.push({
      type: 'warning',
      message: 'Vehicle mass seems unusual (typical range: 50-2000 kg)',
    });
  }

  if (inputs.frictionCoefficient < 0.2 || inputs.frictionCoefficient > 0.9) {
    warnings.push({
      type: 'warning',
      message: 'Friction coefficient seems unusual (typical range: 0.2-0.9)',
    });
  }

  if (inputs.brakeLinePressure < 10 || inputs.brakeLinePressure > 200) {
    warnings.push({
      type: 'warning',
      message: 'Brake line pressure seems unusual (typical range: 10-200 bar)',
    });
  }

  return warnings;
}

export function validateResults(
  inputs: VehicleInputs,
  results: BrakeResults
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (results.stoppingDistance > inputs.desiredStoppingDistance) {
    warnings.push({
      type: 'error',
      message: `Stopping distance (${results.stoppingDistance.toFixed(2)}m) exceeds desired distance (${inputs.desiredStoppingDistance}m)`,
    });
  }

  if (results.deceleration > 9.81) {
    warnings.push({
      type: 'warning',
      message: 'Deceleration exceeds 1G - wheels may lock up causing sliding',
    });
  }

  if (results.deceleration < 3) {
    warnings.push({
      type: 'warning',
      message: 'Low deceleration - consider increasing braking force',
    });
  }

  if (warnings.length === 0 || warnings.every(w => w.type === 'warning')) {
    warnings.push({
      type: 'success',
      message: 'Braking system parameters are within acceptable range!',
    });
  }

  return warnings;
}

export function determineAnimationStatus(
  results: BrakeResults,
  inputs: VehicleInputs
): 'building' | 'complete' | 'failed' {
  if (results.deceleration > 9.81) {
    return 'failed';
  }

  if (results.stoppingDistance > inputs.desiredStoppingDistance * 1.5) {
    return 'failed';
  }

  if (results.stoppingDistance > inputs.desiredStoppingDistance) {
    return 'failed';
  }

  return 'complete';
}

export function getFailureType(
  results: BrakeResults,
  inputs: VehicleInputs
): 'sliding' | 'tilting' | 'insufficient-braking' | undefined {
  if (results.deceleration > 9.81) {
    return 'sliding';
  }

  if (results.stoppingDistance > inputs.desiredStoppingDistance * 1.5) {
    return 'insufficient-braking';
  }

  if (results.stoppingDistance > inputs.desiredStoppingDistance) {
    return 'insufficient-braking';
  }

  return undefined;
}

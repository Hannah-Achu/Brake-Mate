import { BrakeResults, ValidationWarning } from '../types/brake-types';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResultsDisplayProps {
  results: BrakeResults;
  warnings: ValidationWarning[];
}

export default function ResultsDisplay({ results, warnings }: ResultsDisplayProps) {
  const metrics = [
    { label: 'Torque per Wheel', value: results.torquePerWheel.toFixed(2), unit: 'Nm' },
    { label: 'Total Braking Torque', value: results.totalBrakingTorque.toFixed(2), unit: 'Nm' },
    { label: 'Braking Force', value: results.brakingForce.toFixed(2), unit: 'N' },
    { label: 'Deceleration', value: results.deceleration.toFixed(2), unit: 'm/s²' },
    { label: 'Deceleration (G-force)', value: (results.deceleration / 9.81).toFixed(2), unit: 'g' },
    { label: 'Stopping Distance', value: results.stoppingDistance.toFixed(2), unit: 'm' },
    { label: 'Stopping Time', value: results.stoppingTime.toFixed(2), unit: 's' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metric.value} <span className="text-lg text-gray-600">{metric.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Validation Results</h3>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-md ${
                  warning.type === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : warning.type === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                {warning.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : warning.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm ${
                    warning.type === 'error'
                      ? 'text-red-800'
                      : warning.type === 'warning'
                      ? 'text-yellow-800'
                      : 'text-green-800'
                  }`}
                >
                  {warning.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { VehicleInputs } from '../types/brake-types';

interface InputFormProps {
  inputs: VehicleInputs;
  onChange: (inputs: VehicleInputs) => void;
}

export default function InputForm({ inputs, onChange }: InputFormProps) {
  const handleChange = (field: keyof VehicleInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...inputs, [field]: numValue });
  };

  const inputGroups = [
    {
      title: 'Vehicle Parameters',
      fields: [
        { key: 'vehicleMass' as const, label: 'Vehicle Mass', unit: 'kg', step: 10 },
        { key: 'tireRadius' as const, label: 'Tire Radius', unit: 'mm', step: 10 },
        { key: 'initialSpeed' as const, label: 'Initial Speed', unit: 'km/h', step: 5 },
        { key: 'desiredStoppingDistance' as const, label: 'Desired Stopping Distance', unit: 'm', step: 1 },
      ],
    },
    {
      title: 'Brake System',
      fields: [
        { key: 'brakeLinePressure' as const, label: 'Brake Line Pressure', unit: 'bar', step: 5 },
        { key: 'pistonDiameter' as const, label: 'Piston Diameter', unit: 'mm', step: 1 },
        { key: 'mechanicalAdvantage' as const, label: 'Mechanical Advantage', unit: '', step: 0.1 },
        { key: 'frictionCoefficient' as const, label: 'Friction Coefficient', unit: '', step: 0.05 },
        { key: 'effectiveBrakeRadius' as const, label: 'Effective Brake Radius', unit: 'mm', step: 5 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {inputGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{group.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.unit && `(${field.unit})`}
                </label>
                <input
                  type="number"
                  value={inputs[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  step={field.step}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

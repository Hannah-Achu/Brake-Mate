import { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import CarAnimation from './components/CarAnimation';
import { VehicleInputs, BrakeResults, ValidationWarning, AnimationState } from './types/brake-types';
import {
  calculateBrakingPerformance,
  validateInputs,
  validateResults,
  determineAnimationStatus,
  getFailureType,
} from './utils/brake-calculations';
import { Gauge } from 'lucide-react';

function App() {
  const [inputs, setInputs] = useState<VehicleInputs>({
    vehicleMass: 250,
    tireRadius: 250,
    brakeLinePressure: 50,
    pistonDiameter: 30,
    mechanicalAdvantage: 2.5,
    frictionCoefficient: 0.4,
    effectiveBrakeRadius: 100,
    initialSpeed: 60,
    desiredStoppingDistance: 25,
  });

  const [results, setResults] = useState<BrakeResults | null>(null);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState>({
    buildProgress: 0,
    status: 'building',
  });

  useEffect(() => {
    const inputWarnings = validateInputs(inputs);
    const calculatedResults = calculateBrakingPerformance(inputs);
    const resultWarnings = validateResults(inputs, calculatedResults);
    const allWarnings = [...inputWarnings, ...resultWarnings];

    setResults(calculatedResults);
    setWarnings(allWarnings);

    const status = determineAnimationStatus(calculatedResults, inputs);
    const failureType = getFailureType(calculatedResults, inputs);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
      }
      setAnimationState({
        buildProgress: progress,
        status,
        failureType,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">BrakeMate</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Interactive Braking Performance Calculator for SAE BAJA, Formula Student & EV Teams
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <InputForm inputs={inputs} onChange={setInputs} />
          </div>
          <div>
            <CarAnimation animationState={animationState} buildProgress={animationState.buildProgress} />
          </div>
        </div>

        {results && <ResultsDisplay results={results} warnings={warnings} />}
      </div>
    </div>
  );
}

export default App;

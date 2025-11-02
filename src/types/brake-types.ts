export interface VehicleInputs {
  vehicleMass: number;
  tireRadius: number;
  brakeLinePressure: number;
  pistonDiameter: number;
  mechanicalAdvantage: number;
  frictionCoefficient: number;
  effectiveBrakeRadius: number;
  initialSpeed: number;
  desiredStoppingDistance: number;
}

export interface BrakeResults {
  torquePerWheel: number;
  totalBrakingTorque: number;
  brakingForce: number;
  deceleration: number;
  stoppingDistance: number;
  stoppingTime: number;
}

export interface ValidationWarning {
  type: 'error' | 'warning' | 'success';
  message: string;
}

export interface AnimationState {
  buildProgress: number;
  status: 'building' | 'complete' | 'failed';
  failureType?: 'sliding' | 'tilting' | 'insufficient-braking';
}

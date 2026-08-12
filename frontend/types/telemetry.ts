export interface TelemetryReading {
  [key: string]: string | number;
  temperature: number;
  pressure: number;
  rpm: number;
  vibration: number;
  fuel_flow: number;
  exhaust_temperature: number;
  power_output: number;
  efficiency: number;
  health_status: string;
  timestamp: string;
}

export type TelemetryMetricKey =
  | 'temperature'
  | 'pressure'
  | 'rpm'
  | 'vibration'
  | 'fuel_flow'
  | 'exhaust_temperature'
  | 'power_output'
  | 'efficiency';

export type TelemetryHistoryRange = '25' | '50' | '100';

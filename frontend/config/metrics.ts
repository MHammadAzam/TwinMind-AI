export const metrics = [
  { key: 'temperature', label: 'Temperature', unit: '°C', precision: 1 },
  { key: 'pressure', label: 'Pressure', unit: 'bar', precision: 2 },
  { key: 'rpm', label: 'RPM', unit: 'rpm', precision: 1 },
  { key: 'vibration', label: 'Vibration', unit: 'mm/s', precision: 3 },
  { key: 'fuel_flow', label: 'Fuel Flow', unit: 'kg/h', precision: 2 },
  { key: 'exhaust_temperature', label: 'Exhaust Temperature', unit: '°C', precision: 1 },
  { key: 'power_output', label: 'Power Output', unit: 'MW', precision: 2 },
  { key: 'efficiency', label: 'Efficiency', unit: '%', precision: 2 },
] as const;
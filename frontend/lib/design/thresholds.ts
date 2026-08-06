export const thresholds = {
  temperature: { warning: 800, critical: 900, direction: 'above' as const },
  pressure: { warning: 15.5, critical: 17, direction: 'above' as const },
  rpm: { warning: 7800, critical: 8200, direction: 'above' as const },
  vibration: { warning: 0.05, critical: 0.08, direction: 'above' as const },
  fuel_flow: { warning: 4.5, critical: 5.5, direction: 'above' as const },
  exhaust_temperature: { warning: 850, critical: 950, direction: 'above' as const },
  power_output: { warning: 360, critical: 400, direction: 'above' as const },
  efficiency: { warning: 35, critical: 30, direction: 'below' as const },
} as const;

import type { TelemetryReading } from '@/types/telemetry';
import { thresholds } from './thresholds';

export type MetricStatus = 'nominal' | 'warning' | 'critical';

export function getMetricStatus(metric: keyof typeof thresholds, value: number): MetricStatus {
  const limit = thresholds[metric];

  if (limit.direction === 'below') {
    if (value <= limit.critical) {
      return 'critical';
    }

    if (value <= limit.warning) {
      return 'warning';
    }

    return 'nominal';
  }

  if (value >= limit.critical) {
    return 'critical';
  }

  if (value >= limit.warning) {
    return 'warning';
  }

  return 'nominal';
}

export function getOverallStatus(telemetry: TelemetryReading | Record<string, number | string>): MetricStatus {
  let status: MetricStatus = 'nominal';

  for (const key in thresholds) {
    const metric = key as keyof typeof thresholds;
    const value = telemetry[metric];

    if (typeof value !== 'number') {
      continue;
    }

    const result = getMetricStatus(metric, value);

    if (result === 'critical') {
      return 'critical';
    }

    if (result === 'warning') {
      status = 'warning';
    }
  }

  return status;
}

export function getStatusStyles(status: MetricStatus) {
  switch (status) {
    case 'warning':
      return {
        border: 'border-yellow-500/40',
        background: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        chart: '#f59e0b',
      };
    case 'critical':
      return {
        border: 'border-red-500/40',
        background: 'bg-red-500/10',
        text: 'text-red-400',
        chart: '#ef4444',
      };
    default:
      return {
        border: 'border-emerald-500/40',
        background: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        chart: '#34d399',
      };
  }
}

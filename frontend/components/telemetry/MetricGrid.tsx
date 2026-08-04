"use client";

import MetricCard from './MetricCard';
import { metrics } from '@/config/metrics';
import { useCurrentTelemetry } from '@/hooks/useCurrentTelemetry';
import { getMetricStatus } from '@/lib/design/status';

export default function MetricGrid() {
  const { data, isLoading, error } = useCurrentTelemetry();

  if (isLoading) {
    return <div className="rounded border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">Loading telemetry…</div>;
  }

  if (error || !data) {
    return <div className="rounded border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">Telemetry feed unavailable.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const value = data[metric.key];
        const status = getMetricStatus(metric.key, value);

        return (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={Number(value.toFixed(metric.precision))}
            unit={metric.unit}
            status={status}
          />
        );
      })}
    </div>
  );
}
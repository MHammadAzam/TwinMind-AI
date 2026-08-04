import { metrics } from '@/config/metrics';
import type { TelemetryMetricKey } from '@/types/telemetry';

interface MetricSelectorProps {
  selectedMetric: TelemetryMetricKey;
  onSelect: (metric: TelemetryMetricKey) => void;
}

export default function MetricSelector({ selectedMetric, onSelect }: MetricSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-400">
      <span className="uppercase tracking-[0.25em] text-slate-500">Metric</span>
      <select
        value={selectedMetric}
        onChange={(event) => onSelect(event.target.value as TelemetryMetricKey)}
        className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
      >
        {metrics.map((metric) => (
          <option key={metric.key} value={metric.key}>
            {metric.label}
          </option>
        ))}
      </select>
    </label>
  );
}

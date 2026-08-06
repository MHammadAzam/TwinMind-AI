import type { TelemetryMetricKey } from '@/types/telemetry';
import { getMetricStatus, getStatusStyles } from '@/lib/design/status';

interface MetricConfig {
  key: TelemetryMetricKey;
  label: string;
  unit: string;
  precision: number;
}

interface MetricCardProps {
  metric: MetricConfig;
  value: number;
}

export default function MetricCard({ metric, value }: MetricCardProps) {
  const status = getMetricStatus(metric.key, value);
  const styles = getStatusStyles(status);
  const formattedValue = value.toFixed(metric.precision);

  return (
    <div className={`rounded border bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${styles.border}`}>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{metric.label}</p>

      <div className="mt-3 flex items-end gap-3">
        <span className="font-mono text-3xl font-semibold leading-none text-slate-100">{formattedValue}</span>
        <span className="pb-1 text-sm text-slate-400">{metric.unit}</span>
      </div>

      <div className={`mt-4 inline-flex rounded border border-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] ${styles.text}`}>
        {status}
      </div>
    </div>
  );
}
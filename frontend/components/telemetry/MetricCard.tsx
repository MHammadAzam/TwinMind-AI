import { getStatusStyles, MetricStatus } from '@/lib/design/status';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  status: MetricStatus;
}

export default function MetricCard({ label, value, unit, status }: MetricCardProps) {
  const styles = getStatusStyles(status);

  return (
    <div className={`rounded border bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${styles.border}`}>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{label}</p>

      <div className="mt-3 flex items-end gap-2">
        <span className="font-mono text-3xl font-semibold text-slate-100">{value}</span>
        <span className="pb-1 text-sm text-slate-400">{unit}</span>
      </div>

      <div className={`mt-4 inline-flex rounded border border-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] ${styles.text}`}>
        {status}
      </div>
    </div>
  );
}
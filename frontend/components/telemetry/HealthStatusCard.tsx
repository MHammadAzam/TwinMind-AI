import { CheckCircle2, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { getOverallStatus, getStatusStyles, type MetricStatus } from '@/lib/design/status';
import type { TelemetryReading } from '@/types/telemetry';

interface HealthStatusCardProps {
  telemetry: TelemetryReading;
}

const statusConfig: Record<MetricStatus, { label: string; detail: string; Icon: LucideIcon }> = {
  nominal: {
    label: 'NOMINAL',
    detail: 'All monitored turbine values are inside the defined operating envelope.',
    Icon: CheckCircle2,
  },
  warning: {
    label: 'WARNING',
    detail: 'One or more telemetry values are approaching a configured limit.',
    Icon: TriangleAlert,
  },
  critical: {
    label: 'CRITICAL',
    detail: 'A critical threshold has been reached and requires immediate attention.',
    Icon: OctagonAlert,
  },
};

export default function HealthStatusCard({ telemetry }: HealthStatusCardProps) {
  const status = getOverallStatus(telemetry);
  const styles = getStatusStyles(status);
  const { label, detail, Icon } = statusConfig[status];

  return (
    <section className={`rounded border px-6 py-6 ${styles.border} ${styles.background}`}>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className={`rounded border border-slate-800 bg-slate-950/70 p-3 ${styles.text}`}>
            <Icon size={28} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Health state</p>
            <p className={`mt-2 text-4xl font-semibold uppercase ${styles.text}`}>{label}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">Threshold-derived turbine status</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{detail}</p>
          </div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-400 md:text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-600">Timestamp</p>
          <p className="mt-1 font-mono text-slate-200">{telemetry.timestamp}</p>
        </div>
      </div>
    </section>
  );
}

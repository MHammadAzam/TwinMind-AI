import { CheckCircle2, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { getOverallStatus, getStatusStyles, type MetricStatus } from '@/lib/design/status';
import type { TelemetryReading } from '@/types/telemetry';

interface StatusBannerProps {
  telemetry: TelemetryReading;
}

const statusDetails: Record<MetricStatus, { label: string; message: string; Icon: LucideIcon }> = {
  nominal: {
    label: 'NOMINAL',
    message: 'All systems operating within normal range',
    Icon: CheckCircle2,
  },
  warning: {
    label: 'WARNING',
    message: 'One or more telemetry values require attention',
    Icon: TriangleAlert,
  },
  critical: {
    label: 'CRITICAL',
    message: 'Critical operating condition detected',
    Icon: OctagonAlert,
  },
};

export default function StatusBanner({ telemetry }: StatusBannerProps) {
  const status = getOverallStatus(telemetry);
  const styles = getStatusStyles(status);
  const { label, message, Icon } = statusDetails[status];

  return (
    <section className={`w-full rounded border px-5 py-4 ${styles.border} ${styles.background}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Icon className={styles.text} size={20} strokeWidth={2.4} />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">System status</p>
            <p className="mt-1 text-sm text-slate-300">
              <span className={`font-semibold uppercase ${styles.text}`}>{label}</span>
              <span className="text-slate-500"> - </span>
              <span>{message}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-slate-300">
          {['NOMINAL', 'WARNING', 'CRITICAL'].map((label) => {
            const active = label.toLowerCase() === status;
            const activeClasses = active ? styles.text : 'text-slate-500';
            return (
              <span key={label} className={`rounded border border-slate-800 px-3 py-1 ${activeClasses}`}>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

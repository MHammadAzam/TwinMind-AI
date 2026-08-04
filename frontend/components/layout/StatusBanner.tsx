import { getOverallStatus, getStatusStyles } from '@/lib/design/status';
import type { TelemetryReading } from '@/types/telemetry';

interface StatusBannerProps {
  reading: TelemetryReading;
}

export default function StatusBanner({ reading }: StatusBannerProps) {
  const status = getOverallStatus(reading);
  const styles = getStatusStyles(status);

  return (
    <section className={`border px-5 py-4 ${styles.border} ${styles.background}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">System status</p>
          <div className="mt-1 flex items-center gap-3">
            <span className={`text-xl font-semibold uppercase ${styles.text}`}>{status}</span>
            <span className="text-sm text-slate-400">Operational envelope</span>
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

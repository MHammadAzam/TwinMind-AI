import { getStatusStyles } from '@/lib/design/status';
import type { TelemetryReading } from '@/types/telemetry';

interface HealthStatusCardProps {
  reading: TelemetryReading;
}

export default function HealthStatusCard({ reading }: HealthStatusCardProps) {
  const healthStatus = reading.health_status.toUpperCase();
  const styles = getStatusStyles(healthStatus === 'HEALTHY' ? 'nominal' : 'warning');

  return (
    <section className={`border px-6 py-6 ${styles.border} ${styles.background}`}>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Health state</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className={`text-4xl font-semibold uppercase ${styles.text}`}>{healthStatus}</p>
          <p className="mt-2 text-sm text-slate-400">Live diagnostics from the turbine control loop.</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/70 px-4 py-3 text-right text-sm text-slate-400">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-600">Timestamp</p>
          <p className="mt-1 font-mono text-slate-200">{reading.timestamp}</p>
        </div>
      </div>
    </section>
  );
}

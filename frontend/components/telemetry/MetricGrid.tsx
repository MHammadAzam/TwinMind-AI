import type { TelemetryReading } from '@/types/telemetry';
import MetricCard from './MetricCard';
import { metrics } from '@/config/metrics';

interface MetricGridProps {
  telemetry: TelemetryReading;
}

export default function MetricGrid({ telemetry }: MetricGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const rawValue = telemetry[metric.key];
        const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);

        return <MetricCard key={metric.key} metric={metric} value={Number.isFinite(value) ? value : 0} />;
      })}
    </div>
  );
}

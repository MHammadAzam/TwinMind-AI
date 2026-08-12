import { useQuery } from '@tanstack/react-query';
import { getTelemetryHistory } from '@/lib/api/telemetry';
import type { TelemetryHistoryRange, TelemetryMetricKey } from '@/types/telemetry';

export function useTelemetryHistory(metric: TelemetryMetricKey, range: TelemetryHistoryRange) {
  return useQuery({
    queryKey: ['telemetry-history', metric, range],
    queryFn: () => getTelemetryHistory(range),
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}

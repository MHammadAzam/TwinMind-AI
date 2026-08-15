import { useQuery } from '@tanstack/react-query';
import { getTelemetryHistory } from '@/lib/api/telemetry';
import type { TelemetryHistoryRange, TelemetryMetricKey } from '@/types/telemetry';

export function useTelemetryHistory(metric: TelemetryMetricKey, range: TelemetryHistoryRange) {
  return useQuery({
    queryKey: ['telemetry-history', metric, range],
    queryFn: () => getTelemetryHistory(range),
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
}

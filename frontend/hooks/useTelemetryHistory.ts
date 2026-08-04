import { useQuery } from '@tanstack/react-query';
import { getTelemetryHistory } from '@/lib/api/telemetry';

export function useTelemetryHistory() {
  return useQuery({
    queryKey: ['telemetry', 'history'],
    queryFn: getTelemetryHistory,
    refetchInterval: 15000,
  });
}

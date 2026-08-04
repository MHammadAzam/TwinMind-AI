import { useQuery } from "@tanstack/react-query";
import { getCurrentTelemetry } from "@/lib/api/telemetry";

export function useCurrentTelemetry() {
  return useQuery({
    queryKey: ["currentTelemetry"],
    queryFn: getCurrentTelemetry,
    refetchInterval: 5000, // refresh every 5 seconds
    refetchOnWindowFocus: true,
  });
}
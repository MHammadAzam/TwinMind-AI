"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentTelemetry } from "@/lib/api/telemetry";

export function useCurrentTelemetry() {
  return useQuery({
    queryKey: ["currentTelemetry"],
    queryFn: async () => {
      const telemetry = await getCurrentTelemetry();
      console.log("Current telemetry refetched", telemetry);
      return telemetry;
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

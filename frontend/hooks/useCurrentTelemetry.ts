"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentTelemetry } from "@/lib/api/telemetry";

export function useCurrentTelemetry() {
  return useQuery({
    queryKey: ["currentTelemetry"],
    queryFn: getCurrentTelemetry,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
}
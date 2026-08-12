import { apiClient } from "./client";
import type { TelemetryHistoryRange, TelemetryReading } from "@/types/telemetry";

export function getCurrentTelemetry() {
  const cacheBuster = Date.now();

  return apiClient<TelemetryReading>(
    `/api/v1/telemetry/current?_=${cacheBuster}`
  );
}

const historyRangeToLimit: Record<TelemetryHistoryRange, number> = {
  '25': 25,
  '50': 50,
  '100': 100,
};

export function getTelemetryHistory(range: TelemetryHistoryRange) {
  const limit = historyRangeToLimit[range];

  return apiClient<TelemetryReading[]>(
    `/api/v1/telemetry/history?limit=${limit}`
  );
}

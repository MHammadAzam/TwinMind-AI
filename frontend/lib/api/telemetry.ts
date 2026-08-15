import { apiClient } from "./client";
import type { TelemetryHistoryOption, TelemetryHistoryRange, TelemetryReading } from "@/types/telemetry";

export const historyRangeOptions: ReadonlyArray<TelemetryHistoryOption> = [
  { label: 'Last 25', value: '25' },
  { label: 'Last 50', value: '50' },
  { label: 'Last 100', value: '100' },
];

export const historyRangeToLimit: Record<TelemetryHistoryRange, number> = {
  '25': 25,
  '50': 50,
  '100': 100,
};

export function getCurrentTelemetry() {
  const cacheBuster = Date.now();

  return apiClient<TelemetryReading>(
    `/api/v1/telemetry/current?_=${cacheBuster}`
  );
}

export function getTelemetryHistory(range: TelemetryHistoryRange) {
  const limit = historyRangeToLimit[range];

  return apiClient<TelemetryReading[]>(
    `/api/v1/telemetry/history?limit=${limit}`
  );
}

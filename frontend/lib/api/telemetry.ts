import { apiClient } from "./client";
import { TelemetryReading } from "@/types/telemetry";

export function getCurrentTelemetry() {
  const cacheBuster = Date.now();

  return apiClient<TelemetryReading>(
    `/api/v1/telemetry/current?_=${cacheBuster}`
  );
}

export function getTelemetryHistory() {
  return apiClient<TelemetryReading[]>(
    "/api/v1/telemetry/history?limit=50"
  );
}

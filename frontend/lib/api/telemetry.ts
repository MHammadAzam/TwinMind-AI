import { apiClient } from "./client";
import { TelemetryReading } from "@/types/telemetry";

export function getCurrentTelemetry() {
  return apiClient<TelemetryReading>(
    "/api/v1/telemetry/current"
  );
}

export function getTelemetryHistory() {
  return apiClient<TelemetryReading[]>(
    "/api/v1/telemetry/history?limit=50"
  );
}
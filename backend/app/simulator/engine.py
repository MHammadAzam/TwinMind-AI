from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any


class TelemetrySimulator:
    def __init__(self) -> None:
        self._history: list[dict[str, Any]] = []
        self._mode = "normal"
        self._load = 0.6
        self._degradation = 0.0
        self._failure_counter = 0

    def _next_mode(self) -> str:
        if self._failure_counter > 0:
            self._failure_counter -= 1
            return "failure"
        if self._degradation > 0.75:
            return "degradation"
        if self._degradation > 0.35:
            return "warning"
        return "normal"

    def _update_state(self) -> None:
        self._mode = self._next_mode()
        if self._mode == "normal":
            self._load = 0.6 + 0.1 * math.sin(len(self._history) / 8)
            self._degradation = max(0.0, self._degradation - 0.01)
        elif self._mode == "warning":
            self._load = 0.72 + 0.05 * math.sin(len(self._history) / 6)
            self._degradation = min(0.8, self._degradation + 0.02)
        elif self._mode == "degradation":
            self._load = 0.8 + 0.05 * math.sin(len(self._history) / 5)
            self._degradation = min(1.0, self._degradation + 0.03)
        else:
            self._load = 0.9
            self._degradation = min(1.0, self._degradation + 0.05)

    def generate_reading(self) -> dict[str, Any]:
        self._update_state()

        load_factor = self._load
        degradation = self._degradation
        vibration = 0.02 + 0.03 * degradation + 0.01 * load_factor
        temperature = 720 + 100 * load_factor + 40 * degradation + 15 * math.sin(len(self._history) / 4)
        pressure = 13.5 + 0.6 * load_factor - 0.3 * degradation
        rpm = 7200 + 900 * load_factor + 120 * degradation
        fuel_flow = 3.0 + 0.6 * load_factor + 0.3 * degradation
        exhaust_temperature = temperature + 55 + 20 * degradation
        power_output = 320 + 120 * load_factor - 40 * degradation
        efficiency = max(24.0, 38.5 - 8.0 * degradation + 0.5 * math.cos(len(self._history) / 5))

        if self._mode == "failure":
            temperature += 80
            pressure -= 1.2
            vibration += 0.04
            efficiency -= 6.0
            power_output -= 60
            self._failure_counter = 0

        health_status = "healthy"
        if self._mode == "warning":
            health_status = "warning"
        elif self._mode == "degradation":
            health_status = "degraded"
        elif self._mode == "failure":
            health_status = "critical"

        reading = {
            "temperature": round(temperature, 2),
            "pressure": round(pressure, 2),
            "rpm": round(rpm, 2),
            "vibration": round(vibration, 2),
            "fuel_flow": round(fuel_flow, 2),
            "exhaust_temperature": round(exhaust_temperature, 2),
            "power_output": round(power_output, 2),
            "efficiency": round(efficiency, 2),
            "health_status": health_status,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self._history.append(reading)
        return reading

    def get_history(self, limit: int = 20) -> list[dict[str, Any]]:
        return list(self._history[-limit:])

    def get_current(self) -> dict[str, Any] | None:
        if not self._history:
            return None
        return self._history[-1]

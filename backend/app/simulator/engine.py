from __future__ import annotations

import math
import threading
import time
from datetime import datetime, timezone
from typing import Any


class TelemetrySimulator:
    def __init__(self, interval_seconds: float = 1.0, max_history: int = 500, auto_generate: bool = True) -> None:
        self._history: list[dict[str, Any]] = []
        self._mode = "normal"
        self._load = 0.6
        self._degradation = 0.0
        self._failure_counter = 0
        self._interval_seconds = interval_seconds
        self._max_history = max_history
        self._auto_generate = auto_generate
        self._stop_event = threading.Event()
        self._last_temperature: float | None = None
        self._last_pressure: float | None = None
        self._last_rpm: float | None = None
        self._last_vibration: float | None = None
        self._last_fuel_flow: float | None = None
        self._last_exhaust_temperature: float | None = None
        self._last_power_output: float | None = None
        self._last_efficiency: float | None = None

        if self._auto_generate:
            self._thread = threading.Thread(target=self._run_generation_loop, daemon=True)
            self._thread.start()

    def _run_generation_loop(self) -> None:
        while not self._stop_event.is_set():
            self.generate_reading()
            self._stop_event.wait(self._interval_seconds)

    def _smooth_value(self, previous: float | None, target: float, factor: float) -> float:
        if previous is None:
            return target
        return previous + (target - previous) * factor

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

        target_vibration = 0.02 + 0.03 * degradation + 0.01 * load_factor
        target_temperature = 720 + 100 * load_factor + 40 * degradation + 15 * math.sin(len(self._history) / 4)
        target_pressure = 13.5 + 0.6 * load_factor - 0.3 * degradation
        target_rpm = 7200 + 900 * load_factor + 120 * degradation
        target_fuel_flow = 3.0 + 0.6 * load_factor + 0.3 * degradation
        target_exhaust_temperature = target_temperature + 55 + 20 * degradation
        target_power_output = 320 + 120 * load_factor - 40 * degradation
        target_efficiency = max(24.0, 38.5 - 8.0 * degradation + 0.5 * math.cos(len(self._history) / 5))

        if self._mode == "failure":
            target_temperature += 80
            target_pressure -= 1.2
            target_vibration += 0.04
            target_efficiency -= 6.0
            target_power_output -= 60
            self._failure_counter = 0

        temperature = self._smooth_value(self._last_temperature, target_temperature, 0.5)
        pressure = self._smooth_value(self._last_pressure, target_pressure, 0.5)
        rpm = self._smooth_value(self._last_rpm, target_rpm, 0.5)
        vibration = self._smooth_value(self._last_vibration, target_vibration, 0.4)
        fuel_flow = self._smooth_value(self._last_fuel_flow, target_fuel_flow, 0.5)
        exhaust_temperature = self._smooth_value(self._last_exhaust_temperature, target_exhaust_temperature, 0.5)
        power_output = self._smooth_value(self._last_power_output, target_power_output, 0.5)
        efficiency = self._smooth_value(self._last_efficiency, target_efficiency, 0.4)

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
        if len(self._history) > self._max_history:
            self._history = self._history[-self._max_history :]

        self._last_temperature = temperature
        self._last_pressure = pressure
        self._last_rpm = rpm
        self._last_vibration = vibration
        self._last_fuel_flow = fuel_flow
        self._last_exhaust_temperature = exhaust_temperature
        self._last_power_output = power_output
        self._last_efficiency = efficiency

        return reading

    def get_history(self, limit: int = 20) -> list[dict[str, Any]]:
        if not self._history:
            self.generate_reading()
        return list(self._history[-limit:])

    def stop(self) -> None:
        self._stop_event.set()

    def get_current(self) -> dict[str, Any] | None:
        if not self._history:
            return None
        return self._history[-1]

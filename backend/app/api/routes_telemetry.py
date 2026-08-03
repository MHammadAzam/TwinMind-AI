from fastapi import APIRouter, Query

from app.schemas.telemetry import TelemetryReading
from app.simulator.engine import TelemetrySimulator

router = APIRouter(prefix="/telemetry", tags=["telemetry"])
simulator = TelemetrySimulator()


@router.get("/current", response_model=TelemetryReading)
def get_current_telemetry() -> TelemetryReading:
    reading = simulator.get_current()
    if reading is None:
        reading = simulator.generate_reading()
    return TelemetryReading(**reading)


@router.get("/history", response_model=list[TelemetryReading])
def get_telemetry_history(limit: int = Query(default=10, ge=1, le=100)) -> list[TelemetryReading]:
    history = simulator.get_history(limit=limit)
    return [TelemetryReading(**entry) for entry in history]

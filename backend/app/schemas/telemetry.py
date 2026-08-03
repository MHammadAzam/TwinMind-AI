from datetime import datetime

from pydantic import BaseModel


class TelemetryReading(BaseModel):
    temperature: float
    pressure: float
    rpm: float
    vibration: float
    fuel_flow: float
    exhaust_temperature: float
    power_output: float
    efficiency: float
    health_status: str
    timestamp: datetime

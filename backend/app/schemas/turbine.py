from pydantic import BaseModel


class TurbineSummary(BaseModel):
    id: str
    name: str
    model: str
    location: str
    status: str

from fastapi import APIRouter, HTTPException

from app.schemas.turbine import TurbineSummary
from app.services.turbine_service import get_turbine_summaries

router = APIRouter(prefix="/turbines", tags=["turbines"])


@router.get("", response_model=list[TurbineSummary])
def list_turbines() -> list[TurbineSummary]:
    return get_turbine_summaries()


@router.get("/{turbine_id}", response_model=TurbineSummary)
def get_turbine(turbine_id: str) -> TurbineSummary:
    turbines = get_turbine_summaries()
    for turbine in turbines:
        if turbine.id == turbine_id:
            return turbine
    raise HTTPException(status_code=404, detail="Turbine not found")

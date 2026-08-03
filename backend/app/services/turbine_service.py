from app.schemas.turbine import TurbineSummary


def get_turbine_summaries() -> list[TurbineSummary]:
    return [
        TurbineSummary(
            id="turbine-001",
            name="GT-1001",
            model="SGT-400",
            location="Lahore Plant",
            status="operational",
        ),
        TurbineSummary(
            id="turbine-002",
            name="GT-1002",
            model="SGT-600",
            location="Karachi Plant",
            status="warning",
        ),
    ]

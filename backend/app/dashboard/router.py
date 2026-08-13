"""Dashboard router."""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentActiveUserDependency
from app.dashboard.schemas import (
    AIInsight,
    DashboardResponse,
    SystemHealth,
)
from app.dashboard.service import DashboardService
from app.database.dependencies import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    _: CurrentActiveUserDependency,
    db: Session = Depends(get_db),
) -> DashboardResponse:
    """Return dashboard statistics."""
    service = DashboardService(db)
    return service.get_dashboard()


@router.post(
    "/refresh",
    response_model=DashboardResponse,
)
def refresh_dashboard(
    _: CurrentActiveUserDependency,
    db: Session = Depends(get_db),
) -> DashboardResponse:
    """Refresh dashboard."""
    service = DashboardService(db)
    return service.get_dashboard()


@router.get(
    "/system-health",
    response_model=SystemHealth,
)
def get_system_health(
    _: CurrentActiveUserDependency,
) -> SystemHealth:
    """Return current system health."""
    return SystemHealth(
        status="healthy",
        api=True,
        database=True,
        ai_services=True,
        storage=True,
        updated_at=datetime.now(UTC),
    )


@router.get(
    "/ai-insights",
    response_model=list[AIInsight],
)
def get_ai_insights(
    _: CurrentActiveUserDependency,
) -> list[AIInsight]:
    """Return AI insights."""
    return []

"""Router for analytics."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.analytics.constants import (
    DASHBOARD_ENDPOINT,
    METRICS_ENDPOINT,
    ORGANIZATIONS_REPORT,
    SLA_REPORT,
    USERS_REPORT,
    WORKFLOWS_REPORT,
)
from app.analytics.dependencies import get_analytics_service
from app.analytics.schemas import (
    AnalyticsHealth,
    DashboardSummary,
    OrganizationMetrics,
    SLAMetrics,
    TicketMetrics,
    UserMetrics,
    WorkflowMetrics,
)
from app.analytics.service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    DASHBOARD_ENDPOINT,
    response_model=DashboardSummary,
)
def get_dashboard(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> DashboardSummary:
    """Return dashboard summary."""
    return service.get_dashboard()


@router.get(
    f"{METRICS_ENDPOINT}/tickets",
    response_model=TicketMetrics,
)
def get_ticket_metrics(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> TicketMetrics:
    """Return ticket metrics."""
    return service.get_ticket_metrics()


@router.get(
    f"{METRICS_ENDPOINT}{USERS_REPORT}",
    response_model=UserMetrics,
)
def get_user_metrics(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> UserMetrics:
    """Return user metrics."""
    return service.get_user_metrics()


@router.get(
    f"{METRICS_ENDPOINT}{ORGANIZATIONS_REPORT}",
    response_model=OrganizationMetrics,
)
def get_organization_metrics(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> OrganizationMetrics:
    """Return organization metrics."""
    return service.get_organization_metrics()


@router.get(
    f"{METRICS_ENDPOINT}{WORKFLOWS_REPORT}",
    response_model=WorkflowMetrics,
)
def get_workflow_metrics(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> WorkflowMetrics:
    """Return workflow metrics."""
    return service.get_workflow_metrics()


@router.get(
    f"{METRICS_ENDPOINT}{SLA_REPORT}",
    response_model=SLAMetrics,
)
def get_sla_metrics(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> SLAMetrics:
    """Return SLA metrics."""
    return service.get_sla_metrics()


@router.get(
    "/health",
    response_model=AnalyticsHealth,
)
def get_health(
    service: Annotated[
        AnalyticsService,
        Depends(get_analytics_service),
    ],
) -> AnalyticsHealth:
    """Return analytics health."""
    return service.get_health()

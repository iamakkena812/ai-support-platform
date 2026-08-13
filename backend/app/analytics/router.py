"""Router for analytics."""

from __future__ import annotations

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.analytics.constants import (
    DASHBOARD_ENDPOINT,
    METRICS_ENDPOINT,
    ORGANIZATIONS_REPORT,
    SLA_REPORT,
    TICKETS_REPORT,
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
from app.auth.dependencies import (
    CurrentActiveUserDependency,
    CurrentSuperuserDependency,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)

AnalyticsServiceDependency = Annotated[
    AnalyticsService,
    Depends(get_analytics_service),
]


@router.get(
    DASHBOARD_ENDPOINT,
    response_model=DashboardSummary,
)
def get_dashboard(
    current_user: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
    start_date: date | None = Query(default=None, alias="startDate"),
    end_date: date | None = Query(default=None, alias="endDate"),
) -> DashboardSummary:
    """Return the dashboard summary for the caller's organization."""
    return service.get_dashboard(
        current_user.organization_id,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    f"{METRICS_ENDPOINT}{TICKETS_REPORT}",
    response_model=TicketMetrics,
)
def get_ticket_metrics(
    current_user: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
    start_date: date | None = Query(default=None, alias="startDate"),
    end_date: date | None = Query(default=None, alias="endDate"),
) -> TicketMetrics:
    """Return ticket metrics for the caller's organization."""
    return service.get_ticket_metrics(
        current_user.organization_id,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    f"{METRICS_ENDPOINT}{USERS_REPORT}",
    response_model=UserMetrics,
)
def get_user_metrics(
    current_user: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
) -> UserMetrics:
    """Return user metrics for the caller's organization."""
    return service.get_user_metrics(current_user.organization_id)


@router.get(
    f"{METRICS_ENDPOINT}{ORGANIZATIONS_REPORT}",
    response_model=OrganizationMetrics,
)
def get_organization_metrics(
    _: CurrentSuperuserDependency,
    service: AnalyticsServiceDependency,
) -> OrganizationMetrics:
    """Return platform-wide organization metrics.

    Restricted to superusers because organization counts span every
    tenant on the platform rather than the caller's own organization.
    """
    return service.get_organization_metrics()


@router.get(
    f"{METRICS_ENDPOINT}{WORKFLOWS_REPORT}",
    response_model=WorkflowMetrics,
)
def get_workflow_metrics(
    current_user: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
) -> WorkflowMetrics:
    """Return workflow metrics for the caller's organization."""
    return service.get_workflow_metrics(current_user.organization_id)


@router.get(
    f"{METRICS_ENDPOINT}{SLA_REPORT}",
    response_model=SLAMetrics,
)
def get_sla_metrics(
    current_user: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
    start_date: date | None = Query(default=None, alias="startDate"),
    end_date: date | None = Query(default=None, alias="endDate"),
) -> SLAMetrics:
    """Return SLA metrics for the caller's organization."""
    return service.get_sla_metrics(
        current_user.organization_id,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    "/health",
    response_model=AnalyticsHealth,
)
def get_health(
    _: CurrentActiveUserDependency,
    service: AnalyticsServiceDependency,
) -> AnalyticsHealth:
    """Return analytics module health."""
    return service.get_health()

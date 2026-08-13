"""Tests for the analytics service."""

from __future__ import annotations

from datetime import date, timedelta
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.analytics.exceptions import InvalidDateRangeError
from app.analytics.schemas import (
    DashboardSummary,
    OrganizationMetrics,
    SLAMetrics,
    TicketMetrics,
    UserMetrics,
    WorkflowMetrics,
)
from app.analytics.service import AnalyticsService
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def test_get_ticket_metrics(
    analytics_service: AnalyticsService,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Return ticket metrics for the organization."""
    result = analytics_service.get_ticket_metrics(organization.id)

    assert isinstance(result, TicketMetrics)
    assert result.total == 1
    assert result.by_status == {"open": 1}
    assert result.by_priority == {"medium": 1}


def test_get_ticket_metrics_rejects_invalid_range(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Reject a start date after the end date."""
    today = date.today()

    with pytest.raises(InvalidDateRangeError):
        analytics_service.get_ticket_metrics(
            organization.id,
            start_date=today,
            end_date=today - timedelta(days=1),
        )


def test_get_user_metrics(
    analytics_service: AnalyticsService,
    organization: Organization,
    user: User,
) -> None:
    """Return user metrics for the organization."""
    result = analytics_service.get_user_metrics(organization.id)

    assert isinstance(result, UserMetrics)
    assert result.total >= 1
    assert result.active + result.inactive == result.total


def test_get_organization_metrics(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Return platform-wide organization metrics."""
    result = analytics_service.get_organization_metrics()

    assert isinstance(result, OrganizationMetrics)
    assert result.total >= 1


def test_get_workflow_metrics_with_none_created(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Return workflow metrics for an organization with none created."""
    result = analytics_service.get_workflow_metrics(organization.id)

    assert isinstance(result, WorkflowMetrics)
    assert result.total == 0
    assert result.active == 0
    assert result.inactive == 0


def test_get_sla_metrics_with_no_policies(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Return full compliance when there are no SLA policies."""
    result = analytics_service.get_sla_metrics(organization.id)

    assert isinstance(result, SLAMetrics)
    assert result.policies == 0
    assert result.breaches == 0
    assert result.compliance_percentage == 100.0


def test_get_sla_metrics_rejects_invalid_range(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Reject a start date after the end date."""
    today = date.today()

    with pytest.raises(InvalidDateRangeError):
        analytics_service.get_sla_metrics(
            organization.id,
            start_date=today,
            end_date=today - timedelta(days=1),
        )


def test_get_dashboard(
    analytics_service: AnalyticsService,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Return the full dashboard summary for the organization."""
    result = analytics_service.get_dashboard(organization.id)

    assert isinstance(result, DashboardSummary)
    assert result.tickets.total == 1
    assert result.projects == 0
    assert result.users >= 1


def test_get_dashboard_rejects_invalid_range(
    analytics_service: AnalyticsService,
    organization: Organization,
) -> None:
    """Reject a start date after the end date."""
    today = date.today()

    with pytest.raises(InvalidDateRangeError):
        analytics_service.get_dashboard(
            organization.id,
            start_date=today,
            end_date=today - timedelta(days=1),
        )


def test_dashboard_isolated_from_other_organization(
    analytics_service: AnalyticsService,
    db_session: Session,
    ticket: Ticket,
) -> None:
    """An organization's dashboard excludes another organization's data."""
    other_organization = Organization(
        name="Other Org",
        code=f"OTHER-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-example.com",
        phone="+919999999998",
        website="https://other-example.com",
        logo_url="https://other-example.com/logo.png",
        address="1 Other Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500002",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    result = analytics_service.get_dashboard(other_organization.id)

    assert result.tickets.total == 0
    assert result.users == 0

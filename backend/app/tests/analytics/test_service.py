"""Tests for analytics service."""

from __future__ import annotations

from unittest.mock import MagicMock

from app.analytics.repository import AnalyticsRepository
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


def create_service() -> tuple[
    AnalyticsService,
    MagicMock,
]:
    """Create analytics service with mocked repository."""
    repository = MagicMock(spec=AnalyticsRepository)

    repository.count_organizations.return_value = 5
    repository.count_users.return_value = 20
    repository.count_projects.return_value = 8
    repository.count_tickets.return_value = 100
    repository.count_open_tickets.return_value = 25
    repository.count_pending_tickets.return_value = 10
    repository.count_resolved_tickets.return_value = 40
    repository.count_closed_tickets.return_value = 25
    repository.count_sla_breaches.return_value = 3
    repository.count_workflows.return_value = 12
    repository.count_active_users.return_value = 18
    repository.count_active_organizations.return_value = 4
    repository.count_active_workflows.return_value = 10
    repository.count_sla_policies.return_value = 15

    return AnalyticsService(repository), repository


def test_get_dashboard() -> None:
    """Test dashboard summary."""
    service, _ = create_service()

    result = service.get_dashboard()

    assert isinstance(result, DashboardSummary)
    assert result.organizations == 5
    assert result.users == 20
    assert result.projects == 8
    assert result.tickets == 100


def test_get_ticket_metrics() -> None:
    """Test ticket metrics."""
    service, _ = create_service()

    result = service.get_ticket_metrics()

    assert isinstance(result, TicketMetrics)
    assert result.total == 100
    assert result.open == 25
    assert result.pending == 10
    assert result.resolved == 40
    assert result.closed == 25


def test_get_user_metrics() -> None:
    """Test user metrics."""
    service, _ = create_service()

    result = service.get_user_metrics()

    assert isinstance(result, UserMetrics)
    assert result.total == 20
    assert result.active == 18
    assert result.inactive == 2


def test_get_organization_metrics() -> None:
    """Test organization metrics."""
    service, _ = create_service()

    result = service.get_organization_metrics()

    assert isinstance(result, OrganizationMetrics)
    assert result.total == 5
    assert result.active == 4


def test_get_workflow_metrics() -> None:
    """Test workflow metrics."""
    service, _ = create_service()

    result = service.get_workflow_metrics()

    assert isinstance(result, WorkflowMetrics)
    assert result.total == 12
    assert result.active == 10
    assert result.inactive == 2


def test_get_sla_metrics() -> None:
    """Test SLA metrics."""
    service, _ = create_service()

    result = service.get_sla_metrics()

    assert isinstance(result, SLAMetrics)
    assert result.policies == 15
    assert result.breaches == 3
    assert result.compliance_percentage == 80.0


def test_get_health() -> None:
    """Test analytics health."""
    service, _ = create_service()

    result = service.get_health()

    assert isinstance(result, AnalyticsHealth)
    assert result.database is True
    assert result.dashboard is True
    assert result.metrics is True
    assert result.reports is True

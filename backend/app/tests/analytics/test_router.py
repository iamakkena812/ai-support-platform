"""Tests for analytics router."""

from __future__ import annotations

from unittest.mock import MagicMock

from fastapi.testclient import TestClient

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
from app.main import app


def create_mock_service() -> MagicMock:
    """Create mocked analytics service."""
    service = MagicMock()

    service.get_dashboard.return_value = DashboardSummary(
        organizations=5,
        users=20,
        projects=8,
        tickets=100,
        open_tickets=25,
        closed_tickets=25,
        sla_breaches=3,
        workflows=12,
    )

    service.get_ticket_metrics.return_value = TicketMetrics(
        total=100,
        open=25,
        pending=10,
        resolved=40,
        closed=25,
    )

    service.get_user_metrics.return_value = UserMetrics(
        total=20,
        active=18,
        inactive=2,
    )

    service.get_organization_metrics.return_value = OrganizationMetrics(
        total=5,
        active=4,
    )

    service.get_workflow_metrics.return_value = WorkflowMetrics(
        total=12,
        active=10,
        inactive=2,
    )

    service.get_sla_metrics.return_value = SLAMetrics(
        policies=15,
        breaches=3,
        compliance_percentage=80.0,
    )

    service.get_health.return_value = AnalyticsHealth()

    return service


def override_service() -> MagicMock:
    """Override analytics service."""
    return create_mock_service()


app.dependency_overrides[get_analytics_service] = override_service

client = TestClient(app)


def test_get_dashboard() -> None:
    """Test dashboard endpoint."""
    response = client.get("/api/v1/analytics/dashboard")

    assert response.status_code == 200

    data = response.json()

    assert data["organizations"] == 5
    assert data["tickets"] == 100


def test_get_ticket_metrics() -> None:
    """Test ticket metrics endpoint."""
    response = client.get("/api/v1/analytics/metrics/tickets")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 100
    assert data["open"] == 25


def test_get_user_metrics() -> None:
    """Test user metrics endpoint."""
    response = client.get("/api/v1/analytics/metrics/users")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 20
    assert data["active"] == 18


def test_get_organization_metrics() -> None:
    """Test organization metrics endpoint."""
    response = client.get(
        "/api/v1/analytics/metrics/organizations",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 5
    assert data["active"] == 4


def test_get_workflow_metrics() -> None:
    """Test workflow metrics endpoint."""
    response = client.get(
        "/api/v1/analytics/metrics/workflows",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 12
    assert data["active"] == 10


def test_get_sla_metrics() -> None:
    """Test SLA metrics endpoint."""
    response = client.get(
        "/api/v1/analytics/metrics/sla",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["policies"] == 15
    assert data["breaches"] == 3


def test_get_health() -> None:
    """Test health endpoint."""
    response = client.get("/api/v1/analytics/health")

    assert response.status_code == 200

    data = response.json()

    assert data["database"] is True
    assert data["dashboard"] is True
    assert data["metrics"] is True
    assert data["reports"] is True

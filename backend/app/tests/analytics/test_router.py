"""Tests for the analytics router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def _create_teammate(
    db_session: Session,
    client: TestClient,
    organization: Organization,
) -> tuple[User, dict[str, str]]:
    """Create a non-superuser user in the same organization."""
    unique = uuid4().hex[:8]

    teammate = User(
        organization_id=organization.id,
        email=f"{unique}@example.com",
        username=f"teammate{unique}",
        full_name="Teammate User",
        password_hash=hash_password("Password123!"),
        is_active=True,
        is_superuser=False,
    )
    db_session.add(teammate)
    db_session.commit()
    db_session.refresh(teammate)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": teammate.email, "password": "Password123!"},
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return teammate, {"Authorization": f"Bearer {token}"}


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> tuple[User, dict[str, str]]:
    """Create a second organization/user and return their auth headers."""
    unique = uuid4().hex[:8]

    other_organization = Organization(
        name=f"Other Org {unique}",
        code=f"OTHERORG-{unique}",
        email=f"{unique}@other-example.com",
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

    other_user = User(
        organization_id=other_organization.id,
        email=f"{unique}@other-example.com",
        username=f"user{unique}",
        full_name="Other Org User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": other_user.email, "password": "Password123!"},
    )
    assert response.status_code == 200

    token = response.json()["access_token"]

    return other_user, {"Authorization": f"Bearer {token}"}


def test_get_dashboard(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Return the dashboard summary for the caller's organization."""
    response = client.get("/api/v1/analytics/dashboard", headers=auth_headers)

    assert response.status_code == 200

    body = response.json()
    assert body["tickets"]["total"] == 1
    assert body["tickets"]["byStatus"] == {"open": 1}
    assert "sla" in body


def test_get_dashboard_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous access."""
    response = client.get("/api/v1/analytics/dashboard")

    assert response.status_code == 401


def test_get_dashboard_with_date_range(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Filter the dashboard by a custom date range."""
    response = client.get(
        "/api/v1/analytics/dashboard",
        headers=auth_headers,
        params={"startDate": "2000-01-01", "endDate": "2000-01-31"},
    )

    assert response.status_code == 200
    assert response.json()["tickets"]["total"] == 0


def test_get_dashboard_rejects_invalid_date_range(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Reject a start date after the end date."""
    response = client.get(
        "/api/v1/analytics/dashboard",
        headers=auth_headers,
        params={"startDate": "2030-01-01", "endDate": "2020-01-01"},
    )

    assert response.status_code == 400


def test_get_ticket_metrics(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Return ticket metrics for the caller's organization."""
    response = client.get(
        "/api/v1/analytics/metrics/tickets",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["total"] == 1
    assert body["byPriority"] == {"medium": 1}


def test_get_user_metrics(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Return user metrics for the caller's organization."""
    response = client.get(
        "/api/v1/analytics/metrics/users",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["total"] >= 1
    assert body["active"] + body["inactive"] == body["total"]


def test_get_workflow_metrics(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return workflow metrics for the caller's organization."""
    response = client.get(
        "/api/v1/analytics/metrics/workflows",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["total"] == 0


def test_get_sla_metrics(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return SLA metrics for the caller's organization."""
    response = client.get(
        "/api/v1/analytics/metrics/sla",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["policies"] == 0
    assert body["compliancePercentage"] == 100.0


def test_get_health(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return analytics health for an authenticated caller."""
    response = client.get(
        "/api/v1/analytics/health",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["database"] is True


def test_get_health_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous access to the health endpoint."""
    response = client.get("/api/v1/analytics/health")

    assert response.status_code == 401


def test_get_organization_metrics_requires_superuser(
    client: TestClient,
    db_session: Session,
    organization: Organization,
) -> None:
    """Reject non-superusers from viewing platform-wide organization metrics."""
    _teammate, teammate_headers = _create_teammate(
        db_session,
        client,
        organization,
    )

    response = client.get(
        "/api/v1/analytics/metrics/organizations",
        headers=teammate_headers,
    )

    assert response.status_code == 403


def test_get_organization_metrics_allows_superuser(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Allow superusers to view platform-wide organization metrics."""
    response = client.get(
        "/api/v1/analytics/metrics/organizations",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["total"] >= 1


def test_analytics_isolated_from_other_organization(
    client: TestClient,
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A ticket created in one organization is invisible to another organization."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/analytics/dashboard",
        headers=other_headers,
    )

    assert response.status_code == 200
    assert response.json()["tickets"]["total"] == 0

    ticket_metrics_response = client.get(
        "/api/v1/analytics/metrics/tickets",
        headers=other_headers,
    )

    assert ticket_metrics_response.status_code == 200
    assert ticket_metrics_response.json()["total"] == 0

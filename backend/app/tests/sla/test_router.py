"""Tests for the SLA router."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import cast
from uuid import UUID, uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User
from app.sla.models import SLAEvent


def _policy_payload(**overrides: object) -> dict[str, object]:
    """Return a valid SLA policy creation payload."""
    payload: dict[str, object] = {
        "name": "Default SLA",
        "description": "Default policy",
        "priority": "medium",
        "first_response_minutes": 60,
        "resolution_minutes": 480,
        "business_hours_only": False,
        "is_active": True,
    }
    payload.update(overrides)

    return payload


def _create_policy(
    client: TestClient,
    auth_headers: dict[str, str],
    **overrides: object,
) -> dict[str, object]:
    """Create an SLA policy and return the response body."""
    response = client.post(
        "/api/v1/sla/policies",
        headers=auth_headers,
        json=_policy_payload(**overrides),
    )

    assert response.status_code == 201

    return cast(dict[str, object], response.json())


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> tuple[User, dict[str, str]]:
    """Create a second organization/user and return their auth headers."""
    unique = uuid4().hex[:8]

    other_organization = Organization(
        name=f"Other SLA Org {unique}",
        code=f"OTHERSLA-{unique}",
        email=f"{unique}@other-sla.com",
        phone="+919999999990",
        website="https://other-sla.com",
        logo_url="https://other-sla.com/logo.png",
        address="1 Other SLA Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500010",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    other_user = User(
        organization_id=other_organization.id,
        email=f"{unique}@other-sla.com",
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


def test_create_policy(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test creating an SLA policy scoped to the caller's organization."""
    body = _create_policy(client, auth_headers)

    assert body["name"] == "Default SLA"
    assert body["organization_id"] == str(organization.id)


def test_create_policy_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous policy creation."""
    response = client.post(
        "/api/v1/sla/policies",
        json=_policy_payload(),
    )

    assert response.status_code == 401


def test_list_policies(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List the caller's organization's SLA policies."""
    created = _create_policy(client, auth_headers)

    response = client.get(
        "/api/v1/sla/policies",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert any(item["id"] == created["id"] for item in response.json())


def test_list_policies_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous listing."""
    response = client.get("/api/v1/sla/policies")

    assert response.status_code == 401


def test_list_policies_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A policy created in one organization is invisible to another."""
    created = _create_policy(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/sla/policies",
        headers=other_headers,
    )

    assert response.status_code == 200
    assert all(item["id"] != created["id"] for item in response.json())


def test_get_policy(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve a policy by ID."""
    created = _create_policy(client, auth_headers)

    response = client.get(
        f"/api/v1/sla/policies/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_missing_policy(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing policy."""
    response = client.get(
        f"/api/v1/sla/policies/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_policy_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A policy is invisible and inaccessible to another organization."""
    created = _create_policy(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        f"/api/v1/sla/policies/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_update_policy(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a policy as its owning organization."""
    created = _create_policy(client, auth_headers)

    response = client.patch(
        f"/api/v1/sla/policies/{created['id']}",
        headers=auth_headers,
        json={"name": "Renamed"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Renamed"


def test_update_policy_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A policy cannot be updated from another organization."""
    created = _create_policy(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.patch(
        f"/api/v1/sla/policies/{created['id']}",
        headers=other_headers,
        json={"name": "Hijacked"},
    )

    assert response.status_code == 404


def test_delete_policy(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a policy and confirm it disappears."""
    created = _create_policy(client, auth_headers)

    response = client.delete(
        f"/api/v1/sla/policies/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/sla/policies/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_delete_policy_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A policy cannot be deleted from another organization."""
    created = _create_policy(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.delete(
        f"/api/v1/sla/policies/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_assign_policy(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Assign an SLA policy to a ticket."""
    created = _create_policy(client, auth_headers)

    response = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    assert response.status_code == 201

    data = response.json()
    assert data["ticket_id"] == str(ticket.id)
    assert data["policy_id"] == created["id"]


def test_assign_policy_requires_authentication(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Reject anonymous assignment requests."""
    created = _create_policy(client, auth_headers)

    response = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        json={"policy_id": created["id"]},
    )

    assert response.status_code == 401


def test_assign_policy_missing_ticket_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Assigning a policy to a nonexistent ticket returns 404, not success."""
    created = _create_policy(client, auth_headers)

    response = client.post(
        f"/api/v1/sla/tickets/{uuid4()}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    assert response.status_code == 404


def test_assign_inactive_policy_returns_422(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Assigning an inactive policy is rejected."""
    created = _create_policy(client, auth_headers, is_active=False)

    response = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    assert response.status_code == 422


def test_assign_policy_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A ticket cannot be assigned a policy from another organization."""
    created = _create_policy(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=other_headers,
        json={"policy_id": created["id"]},
    )

    assert response.status_code == 404


def test_record_first_response_and_resolve(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Record a first response and resolution for a tracked ticket."""
    created = _create_policy(client, auth_headers)

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    first_response = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/first-response",
        headers=auth_headers,
    )
    assert first_response.status_code == 200
    assert first_response.json()["first_response_at"] is not None

    resolved = client.post(
        f"/api/v1/sla/tickets/{ticket.id}/resolve",
        headers=auth_headers,
    )
    assert resolved.status_code == 200
    assert resolved.json()["resolved_at"] is not None


def test_get_ticket_sla(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Retrieve the SLA event for a ticket."""
    created = _create_policy(client, auth_headers)

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    response = client.get(
        f"/api/v1/sla/tickets/{ticket.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["ticket_id"] == str(ticket.id)


def test_get_ticket_sla_missing_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """A ticket with no assigned policy returns 404."""
    response = client.get(
        f"/api/v1/sla/tickets/{ticket.id}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_ticket_sla_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A ticket's SLA event is invisible to another organization."""
    created = _create_policy(client, auth_headers)

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        f"/api/v1/sla/tickets/{ticket.id}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_list_breached(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A late first response surfaces the ticket as breached."""
    created = _create_policy(client, auth_headers, first_response_minutes=1)

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    response = client.get(
        f"/api/v1/sla/tickets/{ticket.id}",
        headers=auth_headers,
    )
    event_id = UUID(response.json()["id"])

    event = db_session.get(SLAEvent, event_id)
    assert event is not None
    event.first_response_due = datetime.now(UTC) - timedelta(minutes=5)
    db_session.commit()

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/first-response",
        headers=auth_headers,
    )

    breached_response = client.get(
        "/api/v1/sla/breached",
        headers=auth_headers,
    )

    assert breached_response.status_code == 200
    data = breached_response.json()
    assert any(item["ticket_id"] == str(ticket.id) for item in data)


def test_list_breached_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous breach listing."""
    response = client.get("/api/v1/sla/breached")

    assert response.status_code == 401


def test_list_breached_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """Breached tickets are not visible to another organization."""
    created = _create_policy(client, auth_headers, first_response_minutes=1)

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/assign",
        headers=auth_headers,
        json={"policy_id": created["id"]},
    )

    response = client.get(
        f"/api/v1/sla/tickets/{ticket.id}",
        headers=auth_headers,
    )
    event_id = UUID(response.json()["id"])

    event = db_session.get(SLAEvent, event_id)
    assert event is not None
    event.first_response_due = datetime.now(UTC) - timedelta(minutes=5)
    db_session.commit()

    client.post(
        f"/api/v1/sla/tickets/{ticket.id}/first-response",
        headers=auth_headers,
    )

    _other_user, other_headers = _other_org_headers(client, db_session)

    breached_response = client.get(
        "/api/v1/sla/breached",
        headers=other_headers,
    )

    assert breached_response.status_code == 200
    assert breached_response.json() == []

"""Tests for the workflow router."""

from __future__ import annotations

from typing import cast
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def _workflow_payload(**overrides: object) -> dict[str, object]:
    """Return a valid workflow creation payload."""
    payload: dict[str, object] = {
        "name": "Default Workflow",
        "description": "Test workflow",
        "trigger": "ticket_created",
        "is_active": True,
        "conditions": [],
        "actions": [],
    }
    payload.update(overrides)

    return payload


def _create_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
    **overrides: object,
) -> dict[str, object]:
    """Create a workflow and return the response body."""
    response = client.post(
        "/api/v1/workflows",
        headers=auth_headers,
        json=_workflow_payload(**overrides),
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
        name=f"Other Org {unique}",
        code=f"OTHERORG-{unique}",
        email=f"{unique}@other-example.com",
        phone="+919999999992",
        website="https://other-example.com",
        logo_url="https://other-example.com/logo.png",
        address="1 Other Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500008",
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


def test_create_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test creating a workflow scoped to the caller's organization."""
    body = _create_workflow(client, auth_headers)

    assert body["name"] == "Default Workflow"
    assert body["organization_id"] == str(organization.id)


def test_create_workflow_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous workflow creation."""
    response = client.post(
        "/api/v1/workflows",
        json=_workflow_payload(),
    )

    assert response.status_code == 401


def test_create_workflow_validation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Reject an unsupported trigger value."""
    response = client.post(
        "/api/v1/workflows",
        headers=auth_headers,
        json=_workflow_payload(trigger="not-a-real-trigger"),
    )

    assert response.status_code == 422


def test_list_workflows(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List the caller's organization's workflows."""
    created = _create_workflow(client, auth_headers)

    response = client.get(
        "/api/v1/workflows",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert any(item["id"] == created["id"] for item in response.json())


def test_list_workflows_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous listing."""
    response = client.get("/api/v1/workflows")

    assert response.status_code == 401


def test_list_workflows_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A workflow created in one organization is invisible to another."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/workflows",
        headers=other_headers,
    )

    assert response.status_code == 200
    assert all(item["id"] != created["id"] for item in response.json())


def test_get_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve a workflow by ID."""
    created = _create_workflow(client, auth_headers)

    response = client.get(
        f"/api/v1/workflows/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_missing_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing workflow."""
    response = client.get(
        f"/api/v1/workflows/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_workflow_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A workflow is invisible and inaccessible to another organization."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        f"/api/v1/workflows/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_update_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a workflow as its owning organization."""
    created = _create_workflow(client, auth_headers)

    response = client.patch(
        f"/api/v1/workflows/{created['id']}",
        headers=auth_headers,
        json={"name": "Renamed"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Renamed"


def test_update_workflow_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A workflow cannot be updated from another organization."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.patch(
        f"/api/v1/workflows/{created['id']}",
        headers=other_headers,
        json={"name": "Hijacked"},
    )

    assert response.status_code == 404


def test_delete_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a workflow and confirm it disappears."""
    created = _create_workflow(client, auth_headers)

    response = client.delete(
        f"/api/v1/workflows/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/workflows/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_delete_workflow_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A workflow cannot be deleted from another organization."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.delete(
        f"/api/v1/workflows/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_activate_and_deactivate_workflow(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Activate and deactivate a workflow."""
    created = _create_workflow(client, auth_headers)

    deactivated = client.post(
        f"/api/v1/workflows/{created['id']}/deactivate",
        headers=auth_headers,
    )
    assert deactivated.status_code == 200
    assert deactivated.json()["is_active"] is False

    activated = client.post(
        f"/api/v1/workflows/{created['id']}/activate",
        headers=auth_headers,
    )
    assert activated.status_code == 200
    assert activated.json()["is_active"] is True


def test_activate_workflow_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A workflow cannot be activated from another organization."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/activate",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_execute_workflow_reports_not_configured(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Executing a valid workflow honestly reports 501, not a fake success."""
    created = _create_workflow(client, auth_headers)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/execute",
        headers=auth_headers,
        json={"ticket_id": str(ticket.id)},
    )

    assert response.status_code == 501


def test_execute_workflow_requires_authentication(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Reject anonymous execution requests."""
    created = _create_workflow(client, auth_headers)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/execute",
        json={"ticket_id": str(ticket.id)},
    )

    assert response.status_code == 401


def test_execute_workflow_missing_ticket_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Executing against a nonexistent ticket returns 404, not success."""
    created = _create_workflow(client, auth_headers)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/execute",
        headers=auth_headers,
        json={"ticket_id": str(uuid4())},
    )

    assert response.status_code == 404


def test_execute_disabled_workflow_returns_422(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Executing a disabled workflow is rejected."""
    created = _create_workflow(client, auth_headers, is_active=False)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/execute",
        headers=auth_headers,
        json={"ticket_id": str(ticket.id)},
    )

    assert response.status_code == 422


def test_execute_workflow_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A workflow cannot be executed from another organization."""
    created = _create_workflow(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        f"/api/v1/workflows/{created['id']}/execute",
        headers=other_headers,
        json={"ticket_id": str(ticket.id)},
    )

    assert response.status_code == 404

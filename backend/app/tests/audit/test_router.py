"""Tests for the audit router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.audit.models import AuditLog
from app.models.organization import Organization
from app.models.user import User


def test_create_audit_log(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Test creating an audit log."""
    response = client.post(
        "/api/v1/audit",
        json={
            "organization_id": str(organization.id),
            "user_id": str(user.id),
            "action": "create",
            "entity_type": "ticket",
            "entity_id": str(uuid4()),
            "entity_name": "Ticket-1",
            "old_values": None,
            "new_values": {"status": "open"},
            "ip_address": "127.0.0.1",
            "user_agent": "pytest",
            "request_id": f"req-{uuid4().hex[:8]}",
            "status": "success",
        },
        headers=auth_headers,
    )

    assert response.status_code == 201

    data = response.json()["audit_log"]

    assert data["action"] == "create"
    assert data["entity_type"] == "ticket"
    assert data["status"] == "success"


def test_list_audit_logs(
    client: TestClient,
    auth_headers: dict[str, str],
    audit_log: AuditLog,
) -> None:
    """Test listing audit logs."""
    response = client.get(
        "/api/v1/audit",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


def test_get_audit_log(
    client: TestClient,
    auth_headers: dict[str, str],
    audit_log: AuditLog,
) -> None:
    """Test retrieving an audit log."""
    response = client.get(
        f"/api/v1/audit/{audit_log.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(audit_log.id)
    assert data["action"] == audit_log.action


def test_get_missing_audit_log(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a missing audit log."""
    response = client.get(
        f"/api/v1/audit/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_search_audit_logs(
    client: TestClient,
    auth_headers: dict[str, str],
    audit_log: AuditLog,
) -> None:
    """Test searching audit logs."""
    response = client.get(
        "/api/v1/audit/search",
        params={
            "organization_id": str(audit_log.organization_id),
            "action": audit_log.action,
        },
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert data["total"] >= 1

    first = data["items"][0]

    assert first["organization_id"] == str(audit_log.organization_id)
    assert first["action"] == audit_log.action


def test_get_entity_history(
    client: TestClient,
    auth_headers: dict[str, str],
    audit_log: AuditLog,
) -> None:
    """Test retrieving entity history."""
    response = client.get(
        (f"/api/v1/audit/entity/" f"{audit_log.entity_type}/{audit_log.entity_id}"),
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1

    first = data[0]

    assert first["id"] == str(audit_log.id)
    assert first["entity_type"] == audit_log.entity_type
    assert first["entity_id"] == str(audit_log.entity_id)
    assert first["action"] == audit_log.action


def test_get_user_history(
    client: TestClient,
    auth_headers: dict[str, str],
    audit_log: AuditLog,
) -> None:
    """Test retrieving user history."""
    response = client.get(
        f"/api/v1/audit/user/{audit_log.user_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1

    first = data[0]

    assert first["id"] == str(audit_log.id)
    assert first["user_id"] == str(audit_log.user_id)
    assert first["action"] == audit_log.action
    assert first["entity_type"] == audit_log.entity_type
    assert first["status"] == audit_log.status

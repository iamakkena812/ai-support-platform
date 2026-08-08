"""Tests for permission API router."""

from __future__ import annotations

from app.permissions.exceptions import (
    PermissionAlreadyExistsError,
    PermissionInUseError,
    PermissionNotFoundError,
)
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from app.permissions.service import PermissionService


def test_list_permissions(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission list endpoint should return permissions."""
    permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    response = client.get("/api/v1/permissions")

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert body["page"] == 1
    assert body["page_size"] == 20
    assert body["total_pages"] == 1
    assert len(body["items"]) == 1
    assert body["items"][0]["name"] == "Create User"


def test_list_permissions_with_filters(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission list endpoint should support resource filtering."""
    permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    permission_factory(
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    response = client.get(
        "/api/v1/permissions",
        params={"resource": "ticket"},
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert body["items"][0]["resource"] == "ticket"


def test_list_permissions_with_action_filter(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission list endpoint should support action filtering."""
    permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    permission_factory(
        name="Read User",
        resource="user",
        action="read",
    )

    response = client.get(
        "/api/v1/permissions",
        params={"action": "read"},
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert body["items"][0]["action"] == "read"


def test_get_permission_success(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission detail endpoint should return a permission."""
    permission = permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    response = client.get(
        f"/api/v1/permissions/{permission.id}",
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == str(permission.id)
    assert body["name"] == "Create User"
    assert body["resource"] == "user"
    assert body["action"] == "create"


def test_get_permission_not_found(
    client: TestClient,
) -> None:
    """Permission detail endpoint should return 404."""
    response = client.get(
        f"/api/v1/permissions/{uuid4()}",
    )

    assert response.status_code == 404


def test_create_permission_success(
    client: TestClient,
) -> None:
    """Permission creation endpoint should create a permission."""
    payload = {
        "name": "Create Ticket",
        "resource": "ticket",
        "action": "create",
        "description": "Create tickets.",
    }

    response = client.post(
        "/api/v1/permissions",
        json=payload,
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "Create Ticket"
    assert body["resource"] == "ticket"
    assert body["action"] == "create"
    assert body["description"] == "Create tickets."
    assert "id" in body


def test_create_permission_duplicate(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission creation should reject duplicate resource/action."""
    permission_factory(
        resource="user",
        action="create",
    )

    payload = {
        "name": "Another Create User",
        "resource": "user",
        "action": "create",
    }

    response = client.post(
        "/api/v1/permissions",
        json=payload,
    )

    assert response.status_code == 409


def test_create_permission_validation_error(
    client: TestClient,
) -> None:
    """Permission creation should validate required fields."""
    response = client.post(
        "/api/v1/permissions",
        json={
            "name": "",
            "resource": "user",
            "action": "create",
        },
    )

    assert response.status_code == 422


def test_update_permission_success(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission update endpoint should update a permission."""
    permission = permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    response = client.patch(
        f"/api/v1/permissions/{permission.id}",
        json={
            "name": "Create Users",
            "description": "Updated description.",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == str(permission.id)
    assert body["name"] == "Create Users"
    assert body["description"] == "Updated description."


def test_update_permission_not_found(
    client: TestClient,
) -> None:
    """Permission update should return 404 for missing permission."""
    response = client.patch(
        f"/api/v1/permissions/{uuid4()}",
        json={
            "name": "Updated Permission",
        },
    )

    assert response.status_code == 404


def test_update_permission_duplicate(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission update should reject duplicate resource/action."""
    first = permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    second = permission_factory(
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    response = client.patch(
        f"/api/v1/permissions/{second.id}",
        json={
            "resource": first.resource,
            "action": first.action,
        },
    )

    assert response.status_code == 409


def test_delete_permission_success(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission delete endpoint should delete a permission."""
    permission = permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    response = client.delete(
        f"/api/v1/permissions/{permission.id}",
    )

    assert response.status_code == 204
    assert response.content == b""


def test_delete_permission_not_found(
    client: TestClient,
) -> None:
    """Permission delete should return 404 for missing permission."""
    response = client.delete(
        f"/api/v1/permissions/{uuid4()}",
    )

    assert response.status_code == 404


def test_delete_permission_in_use(
    client: TestClient,
    permission_factory,
    monkeypatch,
) -> None:
    """Permission delete should return 409 when permission is in use."""
    permission = permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    def mock_delete(
        self: PermissionService,
        permission_id: UUID,
    ) -> None:
        """Raise permission-in-use error."""
        raise PermissionInUseError(
            "Permission is currently in use.",
        )

    monkeypatch.setattr(
        PermissionService,
        "delete",
        mock_delete,
    )

    response = client.delete(
        f"/api/v1/permissions/{permission.id}",
    )

    assert response.status_code == 409


def test_permission_statistics(
    client: TestClient,
    permission_factory,
) -> None:
    """Permission statistics endpoint should return statistics."""
    permission_factory(
        name="Create User",
        resource="user",
        action="create",
    )

    permission_factory(
        name="Read User",
        resource="user",
        action="read",
    )

    permission_factory(
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    response = client.get(
        "/api/v1/permissions/statistics",
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 3
    assert body["resources"] == 2
    assert body["assigned"] == 0
    assert body["unassigned"] == 3


def test_invalid_permission_id(
    client: TestClient,
) -> None:
    """Permission endpoint should reject an invalid UUID."""
    response = client.get(
        "/api/v1/permissions/not-a-uuid",
    )

    assert response.status_code == 422
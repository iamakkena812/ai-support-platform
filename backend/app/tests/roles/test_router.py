"""Tests for the role API router."""

from __future__ import annotations

from collections.abc import Callable
from uuid import uuid4

from fastapi.testclient import TestClient

from app.models.role import Role

RoleFactory = Callable[..., Role]


def test_list_roles(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role list endpoint should return roles."""
    role_factory()

    response = client.get(
        "/api/v1/roles",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert body["page"] == 1
    assert body["page_size"] == 20
    assert body["total_pages"] == 1
    assert len(body["items"]) == 1
    assert body["items"][0]["name"] == "Support Agent"


def test_list_roles_with_search(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role list endpoint should support search."""
    role_factory(name="Support Agent")
    role_factory(name="Support Manager")
    role_factory(name="Customer Viewer")

    response = client.get(
        "/api/v1/roles",
        params={"search": "Support"},
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 2
    assert len(body["items"]) == 2


def test_list_roles_with_system_filter(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role list endpoint should filter system roles."""
    role_factory(
        name="System Admin",
        is_system=True,
    )
    role_factory(
        name="Support Agent",
        is_system=False,
    )

    response = client.get(
        "/api/v1/roles",
        params={"is_system": True},
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert body["items"][0]["is_system"] is True


def test_get_role_success(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role detail endpoint should return a role."""
    role = role_factory()

    response = client.get(
        f"/api/v1/roles/{role.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == str(role.id)
    assert body["name"] == "Support Agent"
    assert body["is_system"] is False


def test_get_role_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role detail endpoint should return 404."""
    response = client.get(
        f"/api/v1/roles/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_create_role_success(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role creation endpoint should create a role."""
    payload = {
        "name": "Support Agent",
        "description": "Handles customer support.",
        "is_system": False,
    }

    response = client.post(
        "/api/v1/roles",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "Support Agent"
    assert body["description"] == "Handles customer support."
    assert body["is_system"] is False
    assert "id" in body


def test_create_role_duplicate(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role creation should reject duplicate names."""
    role_factory(name="Support Agent")

    response = client.post(
        "/api/v1/roles",
        json={
            "name": "Support Agent",
        },
        headers=auth_headers,
    )

    assert response.status_code == 409


def test_create_role_validation_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role creation should validate required fields."""
    response = client.post(
        "/api/v1/roles",
        json={
            "name": "",
        },
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_update_role_success(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role update endpoint should update a role."""
    role = role_factory()

    response = client.patch(
        f"/api/v1/roles/{role.id}",
        json={
            "name": "Senior Support Agent",
            "description": "Updated description.",
        },
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == str(role.id)
    assert body["name"] == "Senior Support Agent"
    assert body["description"] == "Updated description."


def test_update_role_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role update should return 404 for a missing role."""
    response = client.patch(
        f"/api/v1/roles/{uuid4()}",
        json={
            "name": "Updated Role",
        },
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_role_duplicate(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role update should reject duplicate names."""
    first = role_factory(
        name="Support Agent",
    )
    second = role_factory(
        name="Support Manager",
    )

    response = client.patch(
        f"/api/v1/roles/{second.id}",
        json={
            "name": first.name,
        },
        headers=auth_headers,
    )

    assert response.status_code == 409


def test_delete_role_success(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role delete endpoint should delete a role."""
    role = role_factory()

    response = client.delete(
        f"/api/v1/roles/{role.id}",
        headers=auth_headers,
    )

    assert response.status_code == 204
    assert response.content == b""


def test_delete_role_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role delete should return 404 for a missing role."""
    response = client.delete(
        f"/api/v1/roles/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_delete_system_role(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """System roles should not be deletable."""
    role = role_factory(
        name="System Admin",
        is_system=True,
    )

    response = client.delete(
        f"/api/v1/roles/{role.id}",
        headers=auth_headers,
    )

    assert response.status_code == 409


def test_update_system_role(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """System roles should not be editable."""
    role = role_factory(
        name="System Admin",
        is_system=True,
    )

    response = client.patch(
        f"/api/v1/roles/{role.id}",
        json={
            "name": "Updated Admin",
        },
        headers=auth_headers,
    )

    assert response.status_code == 409


def test_role_statistics(
    client: TestClient,
    role_factory: RoleFactory,
    auth_headers: dict[str, str],
) -> None:
    """Role statistics endpoint should return statistics."""
    role_factory(
        name="System Admin",
        is_system=True,
    )
    role_factory(
        name="Support Agent",
        is_system=False,
    )
    role_factory(
        name="Support Manager",
        is_system=False,
    )

    response = client.get(
        "/api/v1/roles/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 3
    assert body["system"] == 1
    assert body["custom"] == 2
    assert body["assigned"] == 0
    assert body["unassigned"] == 3


def test_invalid_role_id(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Role endpoint should reject an invalid UUID."""
    response = client.get(
        "/api/v1/roles/not-a-uuid",
        headers=auth_headers,
    )

    assert response.status_code == 422
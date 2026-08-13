"""Integration tests for the project router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.models.organization import Organization
from app.models.user import User


def test_create_project(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Create a project as the authenticated user's organization."""
    response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "Support Platform",
            "description": "AI Customer Support Platform",
            "priority": "high",
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "Support Platform"
    assert body["priority"] == "high"
    assert body["status"] == "active"
    assert body["organization"]["id"] == str(organization.id)
    assert body["owner"]["id"] == str(user.id)
    assert body["teams"] == []
    assert body["members"] == []
    assert body["key"]


def test_create_project_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous project creation."""
    response = client.post(
        "/api/v1/projects",
        json={
            "name": "Support Platform",
        },
    )

    assert response.status_code == 401


def test_create_project_duplicate_name(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return conflict when the project name already exists."""
    payload = {
        "name": "Duplicate Project",
    }

    first = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json=payload,
    )
    assert first.status_code == 201

    second = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json=payload,
    )

    assert second.status_code == 409


def test_list_projects(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List projects."""
    client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Listed Project"},
    )

    response = client.get(
        "/api/v1/projects",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body["items"], list)
    assert body["total"] >= 1
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_list_projects_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous project listing."""
    response = client.get("/api/v1/projects")

    assert response.status_code == 401


def test_list_projects_filters_by_status(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Filter projects by status."""
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Archivable Project"},
    )
    project_id = create_response.json()["id"]

    client.put(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
        json={"status": "archived"},
    )

    response = client.get(
        "/api/v1/projects",
        headers=auth_headers,
        params={"status": "archived"},
    )

    assert response.status_code == 200

    body = response.json()
    assert any(item["id"] == project_id for item in body["items"])
    assert all(item["status"] == "archived" for item in body["items"])


def test_get_project(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return a project by id."""
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Retrievable Project"},
    )
    project_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == project_id


def test_get_project_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing project."""
    response = client.get(
        f"/api/v1/projects/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_project(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a project."""
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Updatable Project"},
    )
    project_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "Updated Project",
            "description": "Updated description",
            "priority": "critical",
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["name"] == "Updated Project"
    assert body["description"] == "Updated description"
    assert body["priority"] == "critical"


def test_update_project_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while updating a missing project."""
    response = client.put(
        f"/api/v1/projects/{uuid4()}",
        headers=auth_headers,
        json={},
    )

    assert response.status_code == 404


def test_delete_project(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a project and confirm it disappears from subsequent lookups."""
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Deletable Project"},
    )
    project_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Project deleted successfully."

    follow_up = client.get(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_deleted_project_name_stays_reserved_with_clean_conflict(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """A soft-deleted project's name is still unavailable.

    The DB-level UNIQUE constraint on ``Project.name`` is not scoped
    to active rows, so reusing it must fail as a clean 409 rather
    than an unhandled IntegrityError/500.
    """
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Reserved Name"},
    )
    project_id = create_response.json()["id"]

    client.delete(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
    )

    second_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Reserved Name"},
    )

    assert second_response.status_code == 409


def test_deleted_project_key_is_not_reused_but_new_key_succeeds(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """A soft-deleted project's key is not reused.

    ``Project.key`` also carries a global UNIQUE constraint, but a
    distinct name must still get a fresh, distinct key rather than
    colliding with the deleted project's key.
    """
    create_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Key Reuse Source"},
    )
    project_id = create_response.json()["id"]
    first_key = create_response.json()["key"]

    client.delete(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
    )

    second_response = client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Key Reuse Source Two"},
    )

    assert second_response.status_code == 201
    assert second_response.json()["key"] != first_key
    assert second_response.json()["key"] != first_key


def test_delete_project_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while deleting a missing project."""
    response = client.delete(
        f"/api/v1/projects/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_project_statistics(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return aggregate project statistics."""
    client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Statistics Project"},
    )

    response = client.get(
        "/api/v1/projects/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["total"] >= 1
    assert "active" in body
    assert "completed" in body
    assert "archived" in body

"""Tests for the project router."""

from __future__ import annotations

from collections.abc import Generator
from datetime import UTC, datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.projects.dependencies import get_project_service
from app.projects.exceptions import (
    ProjectKeyAlreadyExistsError,
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.router import router
from app.projects.service import ProjectService


@pytest.fixture
def project() -> MagicMock:
    """Return a mocked project."""
    project = MagicMock()

    project.id = uuid4()
    project.name = "Support Platform"
    project.key = "SUP"
    project.description = "AI Customer Support Platform"
    project.organization_id = uuid4()
    project.owner_id = uuid4()
    project.is_active = True
    project.created_at = datetime.now(UTC)
    project.updated_at = datetime.now(UTC)

    return project


@pytest.fixture
def service() -> MagicMock:
    """Return a mocked project service."""
    return MagicMock(spec=ProjectService)


@pytest.fixture
def client(
    service: MagicMock,
) -> Generator[TestClient]:
    """Return a test client."""
    app = FastAPI()

    app.include_router(router)

    app.dependency_overrides[get_project_service] = lambda: service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def create_payload() -> dict[str, str]:
    """Return project creation payload."""
    return {
        "name": "Support Platform",
        "key": "SUP",
        "description": "AI Customer Support Platform",
        "organization_id": str(uuid4()),
        "owner_id": str(uuid4()),
    }


def test_create_project_success(
    client: TestClient,
    service: MagicMock,
    project: MagicMock,
    create_payload: dict[str, str],
) -> None:
    """Create a project."""
    service.create_project.return_value = project

    response = client.post(
        "/projects",
        json=create_payload,
    )

    assert response.status_code == 201
    assert response.json()["name"] == project.name

    service.create_project.assert_called_once()


def test_create_project_duplicate_name(
    client: TestClient,
    service: MagicMock,
    create_payload: dict[str, str],
) -> None:
    """Return conflict when name exists."""
    service.create_project.side_effect = ProjectNameAlreadyExistsError(
        "Project name already exists.",
    )

    response = client.post(
        "/projects",
        json=create_payload,
    )

    assert response.status_code == 409


def test_create_project_duplicate_key(
    client: TestClient,
    service: MagicMock,
    create_payload: dict[str, str],
) -> None:
    """Return conflict when key exists."""
    service.create_project.side_effect = ProjectKeyAlreadyExistsError(
        "Project key already exists.",
    )

    response = client.post(
        "/projects",
        json=create_payload,
    )

    assert response.status_code == 409


def test_get_project(
    client: TestClient,
    service: MagicMock,
    project: MagicMock,
) -> None:
    """Return project."""
    service.get_project.return_value = project

    response = client.get(
        f"/projects/{project.id}",
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(project.id)

    service.get_project.assert_called_once()


def test_get_project_not_found(
    client: TestClient,
    service: MagicMock,
) -> None:
    """Return not found."""
    service.get_project.side_effect = ProjectNotFoundError(
        "Project not found.",
    )

    response = client.get(
        f"/projects/{uuid4()}",
    )

    assert response.status_code == 404


def test_list_projects(
    client: TestClient,
    service: MagicMock,
    project: MagicMock,
) -> None:
    """Return project list."""
    service.list_projects.return_value = [
        project,
    ]

    response = client.get("/projects")

    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert len(response.json()["projects"]) == 1

    service.list_projects.assert_called_once_with(
        offset=0,
        limit=100,
    )


def test_update_project(
    client: TestClient,
    service: MagicMock,
    project: MagicMock,
) -> None:
    """Update project."""
    service.update_project.return_value = project

    response = client.put(
        f"/projects/{project.id}",
        json={
            "name": "Updated Project",
            "description": "Updated description",
            "is_active": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(project.id)

    service.update_project.assert_called_once()


def test_update_project_not_found(
    client: TestClient,
    service: MagicMock,
) -> None:
    """Return 404 while updating."""
    service.update_project.side_effect = ProjectNotFoundError(
        "Project not found.",
    )

    response = client.put(
        f"/projects/{uuid4()}",
        json={},
    )

    assert response.status_code == 404


def test_delete_project(
    client: TestClient,
    service: MagicMock,
    project: MagicMock,
) -> None:
    """Delete project."""
    response = client.delete(
        f"/projects/{project.id}",
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Project deleted successfully."

    service.delete_project.assert_called_once_with(
        project.id,
    )


def test_delete_project_not_found(
    client: TestClient,
    service: MagicMock,
) -> None:
    """Return 404 while deleting."""
    service.delete_project.side_effect = ProjectNotFoundError(
        "Project not found.",
    )

    response = client.delete(
        f"/projects/{uuid4()}",
    )

    assert response.status_code == 404

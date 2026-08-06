"""Tests for the workflow router."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import uuid4

from app.main import app
from app.workflows.dependencies import get_workflow_service
from app.workflows.models import Workflow
from fastapi.testclient import TestClient


def test_create_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test creating a workflow."""
    service = MagicMock()
    service.create_workflow.return_value = workflow

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.post(
        "/api/v1/workflows",
        json={
            "organization_id": str(workflow.organization_id),
            "name": workflow.name,
            "description": workflow.description,
            "trigger": workflow.trigger,
            "status": "active",
            "conditions": [],
            "actions": [],
        },
    )

    assert response.status_code == 201
    assert response.json()["id"] == str(workflow.id)

    service.create_workflow.assert_called_once()

    app.dependency_overrides.clear()


def test_list_workflows(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test listing workflows."""
    service = MagicMock()
    service.list_workflows.return_value = [workflow]

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.get("/api/v1/workflows")

    print(response.status_code)
    print(response.json())

    assert response.status_code == 200
    assert len(response.json()) == 1

    service.list_workflows.assert_called_once()

    app.dependency_overrides.clear()


def test_get_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test getting a workflow."""
    service = MagicMock()
    service.get_workflow.return_value = workflow

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.get(
        f"/api/v1/workflows/{workflow.id}",
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(workflow.id)

    service.get_workflow.assert_called_once_with(
        workflow.id,
    )

    app.dependency_overrides.clear()


def test_update_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test updating a workflow."""
    service = MagicMock()
    service.update_workflow.return_value = workflow

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.patch(
        f"/api/v1/workflows/{workflow.id}",
        json={
            "name": "Updated Workflow",
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(workflow.id)

    service.update_workflow.assert_called_once()

    app.dependency_overrides.clear()


def test_delete_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test deleting a workflow."""
    service = MagicMock()

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.delete(
        f"/api/v1/workflows/{workflow.id}",
    )

    assert response.status_code == 204

    service.delete_workflow.assert_called_once_with(
        workflow.id,
    )

    app.dependency_overrides.clear()


def test_activate_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test activating a workflow."""
    service = MagicMock()
    service.activate_workflow.return_value = workflow

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.post(
        f"/api/v1/workflows/{workflow.id}/activate",
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(workflow.id)

    service.activate_workflow.assert_called_once_with(
        workflow.id,
    )

    app.dependency_overrides.clear()


def test_deactivate_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test deactivating a workflow."""
    service = MagicMock()
    service.deactivate_workflow.return_value = workflow

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.post(
        f"/api/v1/workflows/{workflow.id}/deactivate",
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(workflow.id)

    service.deactivate_workflow.assert_called_once_with(
        workflow.id,
    )

    app.dependency_overrides.clear()


def test_execute_workflow(
    client: TestClient,
    workflow: Workflow,
) -> None:
    """Test executing a workflow."""
    service = MagicMock()

    ticket_id = uuid4()

    service.execute_workflow.return_value = {
        "workflow_id": workflow.id,
        "ticket_id": ticket_id,
        "executed": True,
        "actions_executed": 0,
        "message": "Workflow executed successfully.",
    }

    app.dependency_overrides[get_workflow_service] = lambda: service

    response = client.post(
        f"/api/v1/workflows/{workflow.id}/execute",
        json={
            "ticket_id": str(ticket_id),
        },
    )

    assert response.status_code == 200
    assert response.json()["executed"] is True

    service.execute_workflow.assert_called_once_with(
        workflow.id,
        ticket_id,
    )

    app.dependency_overrides.clear()

"""Tests for the workflow repository."""

from __future__ import annotations

from uuid import uuid4

from app.models.organization import Organization
from app.workflows.models import (
    Workflow,
    WorkflowAction,
    WorkflowCondition,
)
from app.workflows.repository import WorkflowRepository
from sqlalchemy.orm import Session


def test_create_workflow(
    db_session: Session,
    organization: Organization,
) -> None:
    """Test creating a workflow."""
    repository = WorkflowRepository(db_session)

    workflow = Workflow(
        organization_id=organization.id,
        name="Default Workflow",
        description="Test workflow",
        trigger="ticket_created",
        is_active=True,
    )

    result = repository.create_workflow(workflow)

    assert result.id is not None
    assert result.name == "Default Workflow"
    assert result.organization_id == organization.id


def test_get_workflow(
    db_session: Session,
    organization: Organization,
    workflow: Workflow,
) -> None:
    """Test getting a workflow."""
    repository = WorkflowRepository(db_session)

    result = repository.get_workflow(workflow.id)

    assert result is not None
    assert result.id == workflow.id


def test_get_workflow_not_found(
    db_session: Session,
) -> None:
    """Test getting an unknown workflow."""
    repository = WorkflowRepository(db_session)

    result = repository.get_workflow(uuid4())

    assert result is None


def test_list_workflows(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test listing workflows."""
    repository = WorkflowRepository(db_session)

    workflows = repository.list_workflows()

    assert workflow in workflows


def test_list_workflows_by_organization(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test filtering workflows by organization."""
    repository = WorkflowRepository(db_session)

    workflows = repository.list_workflows(
        organization_id=workflow.organization_id,
    )

    assert len(workflows) == 1
    assert workflows[0].id == workflow.id


def test_update_workflow(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test updating a workflow."""
    repository = WorkflowRepository(db_session)

    workflow.name = "Updated Workflow"

    result = repository.update_workflow(workflow)

    assert result.name == "Updated Workflow"


def test_delete_workflow(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test deleting a workflow."""
    repository = WorkflowRepository(db_session)

    repository.delete_workflow(workflow)

    assert repository.get_workflow(workflow.id) is None


def test_create_condition(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test creating a workflow condition."""
    repository = WorkflowRepository(db_session)

    condition = WorkflowCondition(
        workflow_id=workflow.id,
        field="priority",
        operator="eq",
        value="high",
    )

    result = repository.create_condition(condition)

    assert result.id is not None
    assert result.workflow_id == workflow.id


def test_list_conditions(
    db_session: Session,
    workflow_condition: WorkflowCondition,
) -> None:
    """Test listing workflow conditions."""
    repository = WorkflowRepository(db_session)

    conditions = repository.list_conditions(
        workflow_condition.workflow_id,
    )

    assert workflow_condition in conditions


def test_create_action(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test creating a workflow action."""
    repository = WorkflowRepository(db_session)

    action = WorkflowAction(
        workflow_id=workflow.id,
        action="assign_user",
        value="support-agent",
        execution_order=1,
    )

    result = repository.create_action(action)

    assert result.id is not None
    assert result.workflow_id == workflow.id


def test_list_actions(
    db_session: Session,
    workflow_action: WorkflowAction,
) -> None:
    """Test listing workflow actions."""
    repository = WorkflowRepository(db_session)

    actions = repository.list_actions(
        workflow_action.workflow_id,
    )

    assert workflow_action in actions


def test_list_by_trigger(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test listing workflows by trigger."""
    repository = WorkflowRepository(db_session)

    workflows = repository.list_by_trigger(
        workflow.trigger,
    )

    assert workflow in workflows


def test_activate_workflow(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test activating a workflow."""
    repository = WorkflowRepository(db_session)

    workflow.is_active = False
    db_session.commit()

    result = repository.activate_workflow(workflow)

    assert result.is_active is True


def test_deactivate_workflow(
    db_session: Session,
    workflow: Workflow,
) -> None:
    """Test deactivating a workflow."""
    repository = WorkflowRepository(db_session)

    result = repository.deactivate_workflow(workflow)

    assert result.is_active is False

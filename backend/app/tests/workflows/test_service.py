"""Tests for the workflow service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from app.models.organization import Organization
from app.workflows.constants import WorkflowAction, WorkflowCondition, WorkflowTrigger
from app.workflows.exceptions import (
    WorkflowDisabledException,
    WorkflowNotFoundException,
)
from app.workflows.models import (
    Workflow,
)
from app.workflows.repository import WorkflowRepository
from app.workflows.schemas import (
    WorkflowActionCreate,
    WorkflowConditionCreate,
    WorkflowCreate,
    WorkflowUpdate,
)
from app.workflows.service import WorkflowService


def test_create_workflow(
    workflow_repository: WorkflowRepository,
    organization: Organization,
) -> None:
    """Test creating a workflow."""
    service = WorkflowService(workflow_repository)

    workflow = WorkflowCreate(
        organization_id=organization.id,
        name="Default Workflow",
        description="Workflow description",
        trigger=WorkflowTrigger.TICKET_CREATED,
        is_active=True,
        conditions=[],
        actions=[],
    )

    result = service.create_workflow(workflow)

    assert result.id is not None
    assert result.name == "Default Workflow"


def test_get_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test getting a workflow."""
    result = workflow_service.get_workflow(workflow.id)

    assert result.id == workflow.id


def test_get_workflow_not_found(
    workflow_service: WorkflowService,
) -> None:
    """Test unknown workflow."""
    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.get_workflow(uuid4())


def test_list_workflows(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test listing workflows."""
    workflows = workflow_service.list_workflows()

    assert workflow in workflows


def test_update_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test updating a workflow."""
    updated = WorkflowUpdate(
        name="Updated Workflow",
    )

    result = workflow_service.update_workflow(
        workflow.id,
        updated,
    )

    assert result.name == "Updated Workflow"


def test_delete_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test deleting a workflow."""
    workflow_service.delete_workflow(workflow.id)

    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.get_workflow(workflow.id)


def test_create_condition(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test creating a condition."""
    condition = WorkflowConditionCreate(
        field=WorkflowCondition.PRIORITY,
        operator="eq",
        value="high",
    )

    result = workflow_service.create_condition(
        workflow.id,
        condition,
    )

    assert result.workflow_id == workflow.id


def test_list_conditions(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test listing conditions."""
    conditions = workflow_service.list_conditions(
        workflow.id,
    )

    assert isinstance(
        conditions,
        list,
    )


def test_create_action(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test creating an action."""
    action = WorkflowActionCreate(
        action=WorkflowAction.ASSIGN_USER,
        value="support",
        execution_order=1,
    )

    result = workflow_service.create_action(
        workflow.id,
        action,
    )

    assert result.workflow_id == workflow.id


def test_list_actions(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test listing actions."""
    actions = workflow_service.list_actions(
        workflow.id,
    )

    assert isinstance(
        actions,
        list,
    )


def test_activate_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test activating workflow."""
    workflow.is_active = False

    result = workflow_service.activate_workflow(
        workflow.id,
    )

    assert result.is_active is True


def test_deactivate_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test deactivating workflow."""
    result = workflow_service.deactivate_workflow(
        workflow.id,
    )

    assert result.is_active is False


def test_execute_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test executing workflow."""
    ticket_id = uuid4()

    result = workflow_service.execute_workflow(
        workflow.id,
        ticket_id,
    )

    assert result.executed is True
    assert result.ticket_id == ticket_id
    assert result.workflow_id == workflow.id
    assert result.actions_executed >= 0
    assert result.message


def test_execute_disabled_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test executing a disabled workflow."""
    workflow.is_active = False
    workflow_service._repository.update_workflow(
        workflow,
    )

    with pytest.raises(
        WorkflowDisabledException,
    ):
        workflow_service.execute_workflow(
            workflow.id,
            uuid4(),
        )

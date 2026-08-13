"""Tests for the workflow service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User
from app.tickets.repository import TicketRepository
from app.workflows.constants import WorkflowAction, WorkflowCondition, WorkflowTrigger
from app.workflows.exceptions import (
    WorkflowDisabledException,
    WorkflowExecutionNotConfiguredException,
    WorkflowNotFoundException,
    WorkflowTicketNotFoundException,
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
    ticket_repository: TicketRepository,
    organization: Organization,
) -> None:
    """Test creating a workflow."""
    service = WorkflowService(workflow_repository, ticket_repository)

    workflow = WorkflowCreate(
        name="Default Workflow",
        description="Workflow description",
        trigger=WorkflowTrigger.TICKET_CREATED,
        is_active=True,
        conditions=[],
        actions=[],
    )

    result = service.create_workflow(workflow, organization.id)

    assert result.id is not None
    assert result.name == "Default Workflow"
    assert result.organization_id == organization.id


def test_get_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test getting a workflow."""
    result = workflow_service.get_workflow(workflow.id, workflow.organization_id)

    assert result.id == workflow.id


def test_get_workflow_not_found(
    workflow_service: WorkflowService,
    organization: Organization,
) -> None:
    """Test unknown workflow."""
    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.get_workflow(uuid4(), organization.id)


def test_get_workflow_isolated_from_other_organization(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """A workflow is invisible when queried under another organization."""
    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.get_workflow(workflow.id, uuid4())


def test_list_workflows(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test listing workflows."""
    workflows = workflow_service.list_workflows(workflow.organization_id)

    assert workflow in workflows


def test_list_workflows_isolated_from_other_organization(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Listing under another organization returns no results."""
    workflows = workflow_service.list_workflows(uuid4())

    assert workflows == []


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
        workflow.organization_id,
        updated,
    )

    assert result.name == "Updated Workflow"


def test_update_workflow_rejects_other_organization(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Updating a workflow from another organization is rejected."""
    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.update_workflow(
            workflow.id,
            uuid4(),
            WorkflowUpdate(name="Hijacked"),
        )


def test_delete_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test deleting a workflow."""
    workflow_service.delete_workflow(workflow.id, workflow.organization_id)

    with pytest.raises(
        WorkflowNotFoundException,
    ):
        workflow_service.get_workflow(workflow.id, workflow.organization_id)


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
        workflow.organization_id,
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
        workflow.organization_id,
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
        workflow.organization_id,
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
        workflow.organization_id,
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
        workflow.organization_id,
    )

    assert result.is_active is True


def test_deactivate_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Test deactivating workflow."""
    result = workflow_service.deactivate_workflow(
        workflow.id,
        workflow.organization_id,
    )

    assert result.is_active is False


def test_execute_workflow_reports_not_configured(
    workflow_service: WorkflowService,
    workflow: Workflow,
    ticket: Ticket,
) -> None:
    """Test that executing a valid workflow honestly reports not-configured.

    No worker/action-dispatch integration exists to actually perform the
    configured actions.
    """
    with pytest.raises(
        WorkflowExecutionNotConfiguredException,
    ):
        workflow_service.execute_workflow(
            workflow.id,
            workflow.organization_id,
            ticket.id,
        )


def test_execute_disabled_workflow(
    workflow_service: WorkflowService,
    workflow: Workflow,
    ticket: Ticket,
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
            workflow.organization_id,
            ticket.id,
        )


def test_execute_workflow_missing_ticket(
    workflow_service: WorkflowService,
    workflow: Workflow,
) -> None:
    """Executing against a nonexistent ticket is rejected, not faked."""
    with pytest.raises(
        WorkflowTicketNotFoundException,
    ):
        workflow_service.execute_workflow(
            workflow.id,
            workflow.organization_id,
            uuid4(),
        )


def test_execute_workflow_rejects_other_organizations_ticket(
    workflow_service: WorkflowService,
    workflow: Workflow,
    db_session: Session,
    user: User,
) -> None:
    """Test that a ticket from another organization is rejected.

    Applies even though the ticket ID itself is real.
    """
    other_organization = Organization(
        name="Other Workflow Org",
        code=f"OTHERWF-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-workflow.com",
        phone="+919999999993",
        website="https://other-workflow.com",
        logo_url="https://other-workflow.com/logo.png",
        address="1 Other Workflow Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500007",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    other_ticket = Ticket(
        organization_id=other_organization.id,
        created_by=user.id,
        assigned_to=user.id,
        title="Other Org Ticket",
        description="Belongs to a different organization",
        status="open",
        priority="medium",
        is_active=True,
    )
    db_session.add(other_ticket)
    db_session.commit()
    db_session.refresh(other_ticket)

    with pytest.raises(
        WorkflowTicketNotFoundException,
    ):
        workflow_service.execute_workflow(
            workflow.id,
            workflow.organization_id,
            other_ticket.id,
        )

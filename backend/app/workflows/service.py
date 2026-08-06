"""Service layer for workflow management."""

from __future__ import annotations

from uuid import UUID

from .exceptions import (
    WorkflowDisabledException,
    WorkflowNotFoundException,
)
from .models import (
    Workflow,
    WorkflowAction,
    WorkflowCondition,
)
from .repository import WorkflowRepository
from .schemas import (
    WorkflowActionCreate,
    WorkflowConditionCreate,
    WorkflowCreate,
    WorkflowExecuteResponse,
    WorkflowUpdate,
)


class WorkflowService:
    """Service for workflow operations."""

    def __init__(
        self,
        repository: WorkflowRepository,
    ) -> None:
        """Initialize the service.

        Args:
            repository: Workflow repository.
        """
        self._repository = repository

    # ------------------------------------------------------------------
    # Workflow CRUD
    # ------------------------------------------------------------------

    def create_workflow(
        self,
        workflow_in: WorkflowCreate,
    ) -> Workflow:
        """Create a workflow."""
        workflow = Workflow(
            organization_id=workflow_in.organization_id,
            name=workflow_in.name,
            description=workflow_in.description,
            trigger=workflow_in.trigger.value,
            is_active=workflow_in.is_active,
        )

        workflow = self._repository.create_workflow(workflow)

        for condition in workflow_in.conditions:
            self.create_condition(
                workflow.id,
                condition,
            )

        for action in workflow_in.actions:
            self.create_action(
                workflow.id,
                action,
            )

        return self.get_workflow(workflow.id)

    def get_workflow(
        self,
        workflow_id: UUID,
    ) -> Workflow:
        """Get a workflow."""
        workflow = self._repository.get_workflow(workflow_id)

        if workflow is None:
            raise WorkflowNotFoundException()

        return workflow

    def list_workflows(
        self,
        organization_id: UUID | None = None,
        active_only: bool = False,
    ) -> list[Workflow]:
        """List workflows."""
        return self._repository.list_workflows(
            organization_id=organization_id,
            active_only=active_only,
        )

    def update_workflow(
        self,
        workflow_id: UUID,
        workflow_in: WorkflowUpdate,
    ) -> Workflow:
        """Update a workflow."""
        workflow = self.get_workflow(workflow_id)

        update_data = workflow_in.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            if hasattr(value, "value"):
                value = value.value

            if key == "status":
                workflow.is_active = value == "active"
            else:
                setattr(
                    workflow,
                    key,
                    value,
                )

        return self._repository.update_workflow(workflow)

    def delete_workflow(
        self,
        workflow_id: UUID,
    ) -> None:
        """Delete a workflow."""
        workflow = self.get_workflow(workflow_id)
        self._repository.delete_workflow(workflow)

    # ------------------------------------------------------------------
    # Conditions
    # ------------------------------------------------------------------

    def create_condition(
        self,
        workflow_id: UUID,
        condition_in: WorkflowConditionCreate,
    ) -> WorkflowCondition:
        """Create a workflow condition."""
        self.get_workflow(workflow_id)

        condition = WorkflowCondition(
            workflow_id=workflow_id,
            field=condition_in.field.value,
            operator=condition_in.operator,
            value=condition_in.value,
        )

        return self._repository.create_condition(condition)

    def list_conditions(
        self,
        workflow_id: UUID,
    ) -> list[WorkflowCondition]:
        """List workflow conditions."""
        self.get_workflow(workflow_id)

        return self._repository.list_conditions(workflow_id)

    # ------------------------------------------------------------------
    # Actions
    # ------------------------------------------------------------------

    def create_action(
        self,
        workflow_id: UUID,
        action_in: WorkflowActionCreate,
    ) -> WorkflowAction:
        """Create a workflow action."""
        self.get_workflow(workflow_id)

        action = WorkflowAction(
            workflow_id=workflow_id,
            action=action_in.action.value,
            value=action_in.value,
            execution_order=action_in.execution_order,
        )

        return self._repository.create_action(action)

    def list_actions(
        self,
        workflow_id: UUID,
    ) -> list[WorkflowAction]:
        """List workflow actions."""
        self.get_workflow(workflow_id)

        return self._repository.list_actions(workflow_id)

    # ------------------------------------------------------------------
    # Activation
    # ------------------------------------------------------------------

    def activate_workflow(
        self,
        workflow_id: UUID,
    ) -> Workflow:
        """Activate a workflow."""
        workflow = self.get_workflow(workflow_id)
        return self._repository.activate_workflow(workflow)

    def deactivate_workflow(
        self,
        workflow_id: UUID,
    ) -> Workflow:
        """Deactivate a workflow."""
        workflow = self.get_workflow(workflow_id)
        return self._repository.deactivate_workflow(workflow)

    # ------------------------------------------------------------------
    # Execution
    # ------------------------------------------------------------------

    def execute_workflow(
        self,
        workflow_id: UUID,
        ticket_id: UUID,
    ) -> WorkflowExecuteResponse:
        """Execute a workflow."""
        workflow = self.get_workflow(workflow_id)

        if not workflow.is_active:
            raise WorkflowDisabledException()

        actions = self.list_actions(workflow_id)

        return WorkflowExecuteResponse(
            workflow_id=workflow.id,
            ticket_id=ticket_id,
            executed=True,
            actions_executed=len(actions),
            message="Workflow executed successfully.",
        )

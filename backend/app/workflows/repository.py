"""Repository for workflow persistence."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import (
    Workflow,
    WorkflowAction,
    WorkflowCondition,
)


class WorkflowRepository:
    """Repository for workflow operations."""

    def __init__(self, session: Session) -> None:
        """Initialize the repository.

        Args:
            session: Database session.
        """
        self._session = session

    # ------------------------------------------------------------------
    # Workflow CRUD
    # ------------------------------------------------------------------

    def create_workflow(
        self,
        workflow: Workflow,
    ) -> Workflow:
        """Create a workflow.

        Args:
            workflow: Workflow model.

        Returns:
            Created workflow.
        """
        self._session.add(workflow)
        self._session.commit()
        self._session.refresh(workflow)
        return workflow

    def get_workflow(
        self,
        workflow_id: UUID,
    ) -> Workflow | None:
        """Get a workflow by identifier.

        Args:
            workflow_id: Workflow identifier.

        Returns:
            Workflow if found, otherwise None.
        """
        stmt = select(Workflow).where(
            Workflow.id == workflow_id,
        )

        return self._session.scalar(stmt)

    def list_workflows(
        self,
        organization_id: UUID | None = None,
        active_only: bool = False,
    ) -> list[Workflow]:
        """List workflows.

        Args:
            organization_id: Optional organization identifier.
            active_only: Whether to return only active workflows.

        Returns:
            List of workflows.
        """
        stmt = select(Workflow)

        if organization_id is not None:
            stmt = stmt.where(
                Workflow.organization_id == organization_id,
            )

        if active_only:
            stmt = stmt.where(
                Workflow.is_active.is_(True),
            )

        return list(self._session.scalars(stmt).all())

    def update_workflow(
        self,
        workflow: Workflow,
    ) -> Workflow:
        """Update a workflow.

        Args:
            workflow: Workflow model.

        Returns:
            Updated workflow.
        """
        self._session.commit()
        self._session.refresh(workflow)
        return workflow

    def delete_workflow(
        self,
        workflow: Workflow,
    ) -> None:
        """Delete a workflow.

        Args:
            workflow: Workflow model.
        """
        self._session.delete(workflow)
        self._session.commit()

    # ------------------------------------------------------------------
    # Conditions
    # ------------------------------------------------------------------

    def create_condition(
        self,
        condition: WorkflowCondition,
    ) -> WorkflowCondition:
        """Create a workflow condition.

        Args:
            condition: Workflow condition.

        Returns:
            Created condition.
        """
        self._session.add(condition)
        self._session.commit()
        self._session.refresh(condition)
        return condition

    def list_conditions(
        self,
        workflow_id: UUID,
    ) -> list[WorkflowCondition]:
        """List workflow conditions.

        Args:
            workflow_id: Workflow identifier.

        Returns:
            List of workflow conditions.
        """
        stmt = select(WorkflowCondition).where(
            WorkflowCondition.workflow_id == workflow_id,
        )

        return list(self._session.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Actions
    # ------------------------------------------------------------------

    def create_action(
        self,
        action: WorkflowAction,
    ) -> WorkflowAction:
        """Create a workflow action.

        Args:
            action: Workflow action.

        Returns:
            Created workflow action.
        """
        self._session.add(action)
        self._session.commit()
        self._session.refresh(action)
        return action

    def list_actions(
        self,
        workflow_id: UUID,
    ) -> list[WorkflowAction]:
        """List workflow actions.

        Args:
            workflow_id: Workflow identifier.

        Returns:
            List of workflow actions.
        """
        stmt = (
            select(WorkflowAction)
            .where(
                WorkflowAction.workflow_id == workflow_id,
            )
            .order_by(
                WorkflowAction.execution_order,
            )
        )

        return list(self._session.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Lookup
    # ------------------------------------------------------------------

    def list_by_trigger(
        self,
        trigger: str,
    ) -> list[Workflow]:
        """List active workflows by trigger.

        Args:
            trigger: Workflow trigger.

        Returns:
            List of matching workflows.
        """
        stmt = select(Workflow).where(
            Workflow.trigger == trigger,
            Workflow.is_active.is_(True),
        )

        return list(self._session.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Activation
    # ------------------------------------------------------------------

    def activate_workflow(
        self,
        workflow: Workflow,
    ) -> Workflow:
        """Activate a workflow.

        Args:
            workflow: Workflow model.

        Returns:
            Updated workflow.
        """
        workflow.is_active = True
        self._session.commit()
        self._session.refresh(workflow)
        return workflow

    def deactivate_workflow(
        self,
        workflow: Workflow,
    ) -> Workflow:
        """Deactivate a workflow.

        Args:
            workflow: Workflow model.

        Returns:
            Updated workflow.
        """
        workflow.is_active = False
        self._session.commit()
        self._session.refresh(workflow)
        return workflow

"""API router for workflow management."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency

from .dependencies import WorkflowServiceDependency
from .models import Workflow
from .schemas import (
    WorkflowCreate,
    WorkflowExecuteRequest,
    WorkflowExecuteResponse,
    WorkflowRead,
    WorkflowUpdate,
)

router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"],
)


@router.post(
    "",
    response_model=WorkflowRead,
    status_code=status.HTTP_201_CREATED,
)
def create_workflow(
    workflow: WorkflowCreate,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Workflow:
    """Create a workflow owned by the caller's organization."""
    return service.create_workflow(
        workflow,
        organization_id=current_user.organization_id,
    )


@router.get(
    "",
    response_model=list[WorkflowRead],
)
def list_workflows(
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
    active_only: bool = Query(default=False),
) -> list[Workflow]:
    """List workflows belonging to the caller's organization."""
    return service.list_workflows(
        organization_id=current_user.organization_id,
        active_only=active_only,
    )


@router.get(
    "/{workflow_id}",
    response_model=WorkflowRead,
)
def get_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Workflow:
    """Get a workflow belonging to the caller's organization."""
    return service.get_workflow(
        workflow_id,
        current_user.organization_id,
    )


@router.patch(
    "/{workflow_id}",
    response_model=WorkflowRead,
)
def update_workflow(
    workflow_id: UUID,
    workflow: WorkflowUpdate,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Workflow:
    """Update a workflow belonging to the caller's organization."""
    return service.update_workflow(
        workflow_id,
        current_user.organization_id,
        workflow,
    )


@router.delete(
    "/{workflow_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> None:
    """Delete a workflow belonging to the caller's organization."""
    service.delete_workflow(
        workflow_id,
        current_user.organization_id,
    )


@router.post(
    "/{workflow_id}/activate",
    response_model=WorkflowRead,
)
def activate_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Workflow:
    """Activate a workflow belonging to the caller's organization."""
    return service.activate_workflow(
        workflow_id,
        current_user.organization_id,
    )


@router.post(
    "/{workflow_id}/deactivate",
    response_model=WorkflowRead,
)
def deactivate_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Workflow:
    """Deactivate a workflow belonging to the caller's organization."""
    return service.deactivate_workflow(
        workflow_id,
        current_user.organization_id,
    )


@router.post(
    "/{workflow_id}/execute",
    response_model=WorkflowExecuteResponse,
)
def execute_workflow(
    workflow_id: UUID,
    request: WorkflowExecuteRequest,
    service: WorkflowServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> WorkflowExecuteResponse:
    """Execute a workflow belonging to the caller's organization."""
    return service.execute_workflow(
        workflow_id,
        current_user.organization_id,
        request.ticket_id,
    )

"""API router for workflow management."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

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
) -> Workflow:
    """Create a workflow."""
    return service.create_workflow(workflow)


@router.get(
    "",
    response_model=list[WorkflowRead],
)
def list_workflows(
    service: WorkflowServiceDependency,
    organization_id: UUID | None = Query(default=None),
    active_only: bool = Query(default=False),
) -> list[Workflow]:
    """List workflows."""
    return service.list_workflows(
        organization_id=organization_id,
        active_only=active_only,
    )


@router.get(
    "/{workflow_id}",
    response_model=WorkflowRead,
)
def get_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
) -> Workflow:
    """Get a workflow by identifier."""
    return service.get_workflow(workflow_id)


@router.patch(
    "/{workflow_id}",
    response_model=WorkflowRead,
)
def update_workflow(
    workflow_id: UUID,
    workflow: WorkflowUpdate,
    service: WorkflowServiceDependency,
) -> Workflow:
    """Update a workflow."""
    return service.update_workflow(
        workflow_id,
        workflow,
    )


@router.delete(
    "/{workflow_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
) -> None:
    """Delete a workflow."""
    service.delete_workflow(workflow_id)


@router.post(
    "/{workflow_id}/activate",
    response_model=WorkflowRead,
)
def activate_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
) -> Workflow:
    """Activate a workflow."""
    return service.activate_workflow(workflow_id)


@router.post(
    "/{workflow_id}/deactivate",
    response_model=WorkflowRead,
)
def deactivate_workflow(
    workflow_id: UUID,
    service: WorkflowServiceDependency,
) -> Workflow:
    """Deactivate a workflow."""
    return service.deactivate_workflow(workflow_id)


@router.post(
    "/{workflow_id}/execute",
    response_model=WorkflowExecuteResponse,
)
def execute_workflow(
    workflow_id: UUID,
    request: WorkflowExecuteRequest,
    service: WorkflowServiceDependency,
) -> WorkflowExecuteResponse:
    """Execute a workflow."""
    return service.execute_workflow(
        workflow_id,
        request.ticket_id,
    )

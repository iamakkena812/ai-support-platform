"""Pydantic schemas for workflow management."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from .constants import (
    WorkflowAction,
    WorkflowCondition,
    WorkflowTrigger,
)

# ---------------------------------------------------------------------
# Workflow Condition
# ---------------------------------------------------------------------


class WorkflowConditionCreate(BaseModel):
    """Schema for creating a workflow condition."""

    field: WorkflowCondition
    operator: str = Field(..., max_length=50)
    value: str = Field(..., max_length=255)


class WorkflowConditionUpdate(BaseModel):
    """Schema for updating a workflow condition."""

    field: WorkflowCondition | None = None
    operator: str | None = Field(default=None, max_length=50)
    value: str | None = Field(default=None, max_length=255)


class WorkflowConditionRead(BaseModel):
    """Schema returned for workflow conditions."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workflow_id: UUID
    field: str
    operator: str
    value: str


# ---------------------------------------------------------------------
# Workflow Action
# ---------------------------------------------------------------------


class WorkflowActionCreate(BaseModel):
    """Schema for creating a workflow action."""

    action: WorkflowAction
    value: str | None = Field(default=None, max_length=255)
    execution_order: int = Field(default=1, ge=1)


class WorkflowActionUpdate(BaseModel):
    """Schema for updating a workflow action."""

    action: WorkflowAction | None = None
    value: str | None = Field(default=None, max_length=255)
    execution_order: int | None = Field(default=None, ge=1)


class WorkflowActionRead(BaseModel):
    """Schema returned for workflow actions."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    workflow_id: UUID
    action: str
    value: str | None
    execution_order: int


# ---------------------------------------------------------------------
# Workflow
# ---------------------------------------------------------------------


class WorkflowCreate(BaseModel):
    """Schema for creating a workflow."""

    organization_id: UUID

    name: str = Field(..., max_length=255)

    description: str | None = None

    trigger: WorkflowTrigger

    is_active: bool = True

    conditions: list[WorkflowConditionCreate] = Field(
        default_factory=list,
    )

    actions: list[WorkflowActionCreate] = Field(
        default_factory=list,
    )


class WorkflowUpdate(BaseModel):
    """Schema for updating a workflow."""

    name: str | None = Field(
        default=None,
        max_length=255,
    )

    description: str | None = None

    trigger: WorkflowTrigger | None = None

    is_active: bool | None = None


class WorkflowRead(BaseModel):
    """Schema returned for workflows."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    organization_id: UUID

    name: str

    description: str | None

    trigger: str

    is_active: bool

    created_at: datetime

    updated_at: datetime

    conditions: list[WorkflowConditionRead] = Field(
        default_factory=list,
    )

    actions: list[WorkflowActionRead] = Field(
        default_factory=list,
    )


# ---------------------------------------------------------------------
# Execute Workflow
# ---------------------------------------------------------------------


class WorkflowExecuteRequest(BaseModel):
    """Schema for executing a workflow."""

    ticket_id: UUID


class WorkflowExecuteResponse(BaseModel):
    """Schema returned after workflow execution."""

    workflow_id: UUID

    ticket_id: UUID

    executed: bool

    actions_executed: int

    message: str


__all__ = [
    "WorkflowCreate",
    "WorkflowUpdate",
    "WorkflowRead",
    "WorkflowConditionCreate",
    "WorkflowConditionUpdate",
    "WorkflowConditionRead",
    "WorkflowActionCreate",
    "WorkflowActionUpdate",
    "WorkflowActionRead",
    "WorkflowExecuteRequest",
    "WorkflowExecuteResponse",
]

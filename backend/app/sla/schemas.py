"""Pydantic schemas for SLA management."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from .constants import (
    SLAPriority,
)


class SLAPolicyBase(BaseModel):
    """Base SLA policy schema."""

    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    priority: SLAPriority
    first_response_minutes: int = Field(gt=0)
    resolution_minutes: int = Field(gt=0)
    business_hours_only: bool = False
    is_active: bool = True


class SLAPolicyCreate(SLAPolicyBase):
    """Schema for creating an SLA policy."""

    organization_id: UUID


class SLAPolicyUpdate(BaseModel):
    """Schema for updating an SLA policy."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    priority: SLAPriority | None = None
    first_response_minutes: int | None = Field(default=None, gt=0)
    resolution_minutes: int | None = Field(default=None, gt=0)
    business_hours_only: bool | None = None
    is_active: bool | None = None


class SLAPolicyRead(SLAPolicyBase):
    """Schema returned for SLA policies."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    created_at: datetime
    updated_at: datetime


class SLAEventBase(BaseModel):
    """Base SLA event schema."""

    ticket_id: UUID
    policy_id: UUID


class SLAEventRead(BaseModel):
    """Schema returned for SLA events."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ticket_id: UUID
    policy_id: UUID

    started_at: datetime
    first_response_due: datetime
    resolution_due: datetime

    first_response_at: datetime | None
    resolved_at: datetime | None

    first_response_breached: bool
    resolution_breached: bool


class BreachedTicket(BaseModel):
    """Schema representing a breached SLA."""

    ticket_id: UUID
    policy_id: UUID
    first_response_breached: bool
    resolution_breached: bool

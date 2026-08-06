"""Pydantic schemas for tickets."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.tickets.constants import (
    DESCRIPTION_MAX_LENGTH,
    DESCRIPTION_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    TITLE_MIN_LENGTH,
    TicketPriority,
    TicketStatus,
)


class CreateTicketRequest(BaseModel):
    """Request model for creating a ticket."""

    assigned_to: UUID | None = None

    title: str = Field(
        min_length=TITLE_MIN_LENGTH,
        max_length=TITLE_MAX_LENGTH,
    )

    description: str = Field(
        min_length=DESCRIPTION_MIN_LENGTH,
        max_length=DESCRIPTION_MAX_LENGTH,
    )

    status: TicketStatus = TicketStatus.OPEN

    priority: TicketPriority = TicketPriority.MEDIUM


class UpdateTicketRequest(BaseModel):
    """Request model for updating a ticket."""

    title: str | None = Field(
        default=None,
        min_length=TITLE_MIN_LENGTH,
        max_length=TITLE_MAX_LENGTH,
    )

    description: str | None = Field(
        default=None,
        min_length=DESCRIPTION_MIN_LENGTH,
        max_length=DESCRIPTION_MAX_LENGTH,
    )

    priority: TicketPriority | None = None

    status: TicketStatus | None = None

    assigned_to: UUID | None = None

    is_active: bool | None = None


class AssignTicketRequest(BaseModel):
    """Assign a ticket to a user."""

    assignee_id: UUID


class TicketResponse(BaseModel):
    """Ticket response."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    organization_id: UUID

    created_by: UUID

    assigned_to: UUID | None

    title: str

    description: str

    status: TicketStatus

    priority: TicketPriority

    is_active: bool

    created_at: datetime

    updated_at: datetime


class TicketListResponse(BaseModel):
    """Paginated ticket response."""

    total: int

    tickets: list[TicketResponse]

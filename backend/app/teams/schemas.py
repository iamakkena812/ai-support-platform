"""Pydantic schemas for Team."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CreateTeamRequest(BaseModel):
    """Request schema for creating a team."""

    organization_id: UUID
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=50)
    description: str | None = Field(default=None, max_length=500)
    lead_id: UUID | None = None


class UpdateTeamRequest(BaseModel):
    """Request schema for updating a team."""

    name: str | None = Field(default=None, min_length=2, max_length=100)
    code: str | None = Field(default=None, min_length=2, max_length=50)
    description: str | None = Field(default=None, max_length=500)
    lead_id: UUID | None = None
    is_active: bool | None = None


class TeamResponse(BaseModel):
    """Response schema for a team."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    lead_id: UUID | None
    name: str
    code: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class TeamListResponse(BaseModel):
    """Response schema for listing teams."""

    items: list[TeamResponse]
    total: int

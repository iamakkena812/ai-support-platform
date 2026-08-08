"""Schemas for role management."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoleCreate(BaseModel):
    """Request schema for creating a role."""

    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    is_system: bool = False


class RoleUpdate(BaseModel):
    """Request schema for updating a role."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)


class RoleListQuery(BaseModel):
    """Query parameters for listing roles."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    search: str | None = None
    is_system: bool | None = None


class RoleResponse(BaseModel):
    """Response schema for a role."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: str | None
    is_system: bool


class RoleListResponse(BaseModel):
    """Paginated role response."""

    items: list[RoleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class RoleStatistics(BaseModel):
    """Role statistics response."""

    total: int
    system: int
    custom: int
    assigned: int
    unassigned: int
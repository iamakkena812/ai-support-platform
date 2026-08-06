"""Project schemas."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.projects.constants import (
    PROJECT_DESCRIPTION_MAX_LENGTH,
    PROJECT_KEY_MAX_LENGTH,
    PROJECT_KEY_MIN_LENGTH,
    PROJECT_NAME_MAX_LENGTH,
    PROJECT_NAME_MIN_LENGTH,
)


class ProjectCreateRequest(BaseModel):
    """Request model for creating a project."""

    name: str = Field(
        min_length=PROJECT_NAME_MIN_LENGTH,
        max_length=PROJECT_NAME_MAX_LENGTH,
    )
    key: str = Field(
        min_length=PROJECT_KEY_MIN_LENGTH,
        max_length=PROJECT_KEY_MAX_LENGTH,
    )
    organization_id: UUID
    owner_id: UUID
    description: str | None = Field(
        default=None,
        max_length=PROJECT_DESCRIPTION_MAX_LENGTH,
    )


class ProjectUpdateRequest(BaseModel):
    """Request model for updating a project."""

    name: str | None = Field(
        default=None,
        min_length=PROJECT_NAME_MIN_LENGTH,
        max_length=PROJECT_NAME_MAX_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=PROJECT_DESCRIPTION_MAX_LENGTH,
    )
    owner_id: UUID | None = None
    is_active: bool | None = None


class ProjectResponse(BaseModel):
    """Project response model."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    key: str
    description: str | None
    organization_id: UUID
    owner_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ProjectListResponse(BaseModel):
    """Project list response."""

    projects: list[ProjectResponse]
    total: int


class ProjectDeleteResponse(BaseModel):
    """Project delete response."""

    message: str

"""Permission API schemas."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import ConfigDict, Field

from app.core.schemas import CamelModel
from app.permissions.constants import (
    DEFAULT_PERMISSION_PAGE,
    DEFAULT_PERMISSION_PAGE_SIZE,
    MAX_PERMISSION_PAGE_SIZE,
    PERMISSION_ACTION_MAX_LENGTH,
    PERMISSION_DESCRIPTION_MAX_LENGTH,
    PERMISSION_NAME_MAX_LENGTH,
    PERMISSION_RESOURCE_MAX_LENGTH,
)


class PermissionBase(CamelModel):
    """Shared permission fields."""

    name: str = Field(
        min_length=1,
        max_length=PERMISSION_NAME_MAX_LENGTH,
    )

    resource: str = Field(
        min_length=1,
        max_length=PERMISSION_RESOURCE_MAX_LENGTH,
    )

    action: str = Field(
        min_length=1,
        max_length=PERMISSION_ACTION_MAX_LENGTH,
    )

    description: str | None = Field(
        default=None,
        max_length=PERMISSION_DESCRIPTION_MAX_LENGTH,
    )


class PermissionCreate(PermissionBase):
    """Permission creation request."""


class PermissionUpdate(CamelModel):
    """Permission update request."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=PERMISSION_NAME_MAX_LENGTH,
    )

    resource: str | None = Field(
        default=None,
        min_length=1,
        max_length=PERMISSION_RESOURCE_MAX_LENGTH,
    )

    action: str | None = Field(
        default=None,
        min_length=1,
        max_length=PERMISSION_ACTION_MAX_LENGTH,
    )

    description: str | None = Field(
        default=None,
        max_length=PERMISSION_DESCRIPTION_MAX_LENGTH,
    )


class PermissionResponse(PermissionBase):
    """Permission response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


class PermissionListQuery(CamelModel):
    """Permission list query parameters."""

    page: int = Field(
        default=DEFAULT_PERMISSION_PAGE,
        ge=1,
    )

    page_size: int = Field(
        default=DEFAULT_PERMISSION_PAGE_SIZE,
        ge=1,
        le=MAX_PERMISSION_PAGE_SIZE,
    )

    search: str | None = Field(
        default=None,
        min_length=1,
    )

    resource: str | None = Field(
        default=None,
        min_length=1,
        max_length=PERMISSION_RESOURCE_MAX_LENGTH,
    )

    action: str | None = Field(
        default=None,
        min_length=1,
        max_length=PERMISSION_ACTION_MAX_LENGTH,
    )


class PermissionListResponse(CamelModel):
    """Paginated permission response."""

    items: list[PermissionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PermissionStatistics(CamelModel):
    """Permission statistics."""

    total: int
    resources: int
    assigned: int
    unassigned: int


# ---------------------------------------------------------------------------
# Backward-compatible API schema names.
# ---------------------------------------------------------------------------


CreatePermissionRequest = PermissionCreate

UpdatePermissionRequest = PermissionUpdate

PermissionStatisticsResponse = PermissionStatistics


__all__ = [
    "CreatePermissionRequest",
    "PermissionBase",
    "PermissionCreate",
    "PermissionListQuery",
    "PermissionListResponse",
    "PermissionResponse",
    "PermissionStatistics",
    "PermissionStatisticsResponse",
    "PermissionUpdate",
    "UpdatePermissionRequest",
]
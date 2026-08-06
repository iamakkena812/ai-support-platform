"""Pydantic schemas for the audit module."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AuditLogBase(BaseModel):
    """Base schema for audit logs."""

    action: str = Field(
        ...,
        min_length=1,
        max_length=50,
    )

    entity_type: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    entity_id: UUID | None = None

    entity_name: str | None = Field(
        default=None,
        max_length=255,
    )

    old_values: dict[str, Any] | None = None

    new_values: dict[str, Any] | None = None

    ip_address: str | None = Field(
        default=None,
        max_length=45,
    )

    user_agent: str | None = None

    request_id: str | None = Field(
        default=None,
        max_length=100,
    )

    status: str = Field(
        default="success",
        max_length=20,
    )


class AuditLogCreate(AuditLogBase):
    """Schema for creating an audit log."""

    organization_id: UUID

    user_id: UUID | None = None


class AuditLogRead(AuditLogBase):
    """Schema returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    organization_id: UUID

    user_id: UUID | None

    created_at: datetime


class AuditLogList(BaseModel):
    """Paginated audit log response."""

    items: list[AuditLogRead]

    total: int


class AuditLogSearch(BaseModel):
    """Audit log search filters."""

    organization_id: UUID | None = None

    user_id: UUID | None = None

    action: str | None = None

    entity_type: str | None = None

    entity_id: UUID | None = None

    status: str | None = None

    page: int = Field(
        default=1,
        ge=1,
    )

    page_size: int = Field(
        default=20,
        ge=1,
        le=100,
    )


class AuditLogCreateResponse(BaseModel):
    """Response returned after creating an audit log."""

    audit_log: AuditLogRead

    message: str = "Audit log created successfully."

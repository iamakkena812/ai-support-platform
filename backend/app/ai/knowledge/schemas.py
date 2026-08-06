"""Pydantic schemas for the Knowledge module."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.knowledge.constants import (
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
    KnowledgeStatus,
    KnowledgeVisibility,
)


class KnowledgeCreate(BaseModel):
    """Schema for creating a knowledge base."""

    name: str = Field(
        min_length=1,
        max_length=MAX_NAME_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=MAX_DESCRIPTION_LENGTH,
    )
    visibility: KnowledgeVisibility = KnowledgeVisibility.PRIVATE
    metadata: dict[str, Any] = Field(default_factory=dict)


class KnowledgeUpdate(BaseModel):
    """Schema for updating a knowledge base."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=MAX_NAME_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=MAX_DESCRIPTION_LENGTH,
    )
    status: KnowledgeStatus | None = None
    visibility: KnowledgeVisibility | None = None
    metadata: dict[str, Any] | None = None


class KnowledgeResponse(BaseModel):
    """Knowledge base response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    name: str
    description: str | None
    status: KnowledgeStatus
    visibility: KnowledgeVisibility
    metadata: dict[str, Any]
    created_by: UUID
    updated_by: UUID | None
    created_at: datetime
    updated_at: datetime


class KnowledgeListResponse(BaseModel):
    """Knowledge list response schema."""

    items: list[KnowledgeResponse]
    total: int
    offset: int
    limit: int

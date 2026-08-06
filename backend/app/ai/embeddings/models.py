"""Models for the AI Embeddings module."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy import JSON, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.models.base import BaseModel


class Embedding(BaseModel):
    """Represents a vector embedding."""

    __tablename__ = "embeddings"

    organization_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    knowledge_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("knowledge_bases.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    provider: Mapped[EmbeddingProvider] = mapped_column(
        Enum(
            EmbeddingProvider,
            name="embedding_provider",
        ),
        nullable=False,
        default=EmbeddingProvider.OPENAI,
    )

    model: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    source_type: Mapped[EmbeddingSourceType] = mapped_column(
        Enum(
            EmbeddingSourceType,
            name="embedding_source_type",
        ),
        nullable=False,
    )

    source_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        nullable=False,
        index=True,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    dimensions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    vector: Mapped[list[float]] = mapped_column(
        JSON,
        nullable=False,
    )

    metadata_json: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )

    status: Mapped[EmbeddingStatus] = mapped_column(
        Enum(
            EmbeddingStatus,
            name="embedding_status",
        ),
        nullable=False,
        default=EmbeddingStatus.PENDING,
    )

    created_by: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    updated_by: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

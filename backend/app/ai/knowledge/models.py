"""Database models for the Knowledge module."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    JSON,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.ai.knowledge.constants import (
    DEFAULT_KNOWLEDGE_STATUS,
    DEFAULT_KNOWLEDGE_VISIBILITY,
    KnowledgeStatus,
    KnowledgeVisibility,
)
from app.database.base import Base


class KnowledgeBase(Base):
    """Knowledge Base model."""

    __tablename__ = "knowledge_bases"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[KnowledgeStatus] = mapped_column(
        Enum(KnowledgeStatus),
        default=DEFAULT_KNOWLEDGE_STATUS,
        nullable=False,
    )

    visibility: Mapped[KnowledgeVisibility] = mapped_column(
        Enum(KnowledgeVisibility),
        default=DEFAULT_KNOWLEDGE_VISIBILITY,
        nullable=False,
    )

    metadata_json: Mapped[dict[str, object]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"),
        default=dict,
        nullable=False,
    )

    created_by: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    updated_by: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

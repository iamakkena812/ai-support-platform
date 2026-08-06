"""Models for the AI RAG module."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy import JSON, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.ai.rag.constants import DEFAULT_PROVIDER
from app.models.base import BaseModel


class RAGGeneration(BaseModel):
    """Represents a Retrieval-Augmented Generation request."""

    __tablename__ = "rag_generations"

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

    provider: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default=DEFAULT_PROVIDER,
    )

    model: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    query: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    response: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    prompt_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    completion_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    total_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    retrieved_documents: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    metadata_json: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
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

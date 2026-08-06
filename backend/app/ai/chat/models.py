"""Database models for AI chat."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.ai.chat.constants import ConversationStatus, MessageStatus, MessageType
from app.database.base import Base


class Conversation(Base):
    """Conversation between a user and an AI model."""

    __tablename__ = "ai_conversations"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    customer_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    ticket_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("tickets.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_by: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    status: Mapped[ConversationStatus] = mapped_column(
        Enum(
            ConversationStatus,
            name="conversation_status",
        ),
        default=ConversationStatus.ACTIVE,
        nullable=False,
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

    messages: Mapped[list[ConversationMessage]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="ConversationMessage.created_at",
    )


class ConversationMessage(Base):
    """Individual message within a conversation."""

    __tablename__ = "ai_conversation_messages"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    conversation_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "ai_conversations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    role: Mapped[MessageType] = mapped_column(
        Enum(
            MessageType,
            name="message_type",
        ),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    token_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    latency_ms: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    status: Mapped[MessageStatus] = mapped_column(
        Enum(
            MessageStatus,
            name="message_status",
        ),
        default=MessageStatus.COMPLETED,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    conversation: Mapped[Conversation] = relationship(
        back_populates="messages",
    )

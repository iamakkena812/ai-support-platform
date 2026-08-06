"""Repository for AI chat."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.chat.models import Conversation, ConversationMessage


class ConversationRepository:
    """Repository for AI conversations."""

    def __init__(self, db: Session) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self._db = db

    def create_conversation(
        self,
        conversation: Conversation,
    ) -> Conversation:
        """Create a conversation."""
        self._db.add(conversation)
        self._db.commit()
        self._db.refresh(conversation)
        return conversation

    def get_conversation(
        self,
        conversation_id: UUID,
    ) -> Conversation | None:
        """Retrieve a conversation by ID."""
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
        )
        return self._db.scalar(statement)

    def list_conversations(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[Conversation]:
        """List conversations for an organization."""
        statement = (
            select(Conversation)
            .where(
                Conversation.organization_id == organization_id,
            )
            .order_by(Conversation.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return list(self._db.scalars(statement).all())

    def count_conversations(
        self,
        organization_id: UUID,
    ) -> int:
        """Count conversations."""
        statement = (
            select(func.count())
            .select_from(Conversation)
            .where(
                Conversation.organization_id == organization_id,
            )
        )
        result = self._db.scalar(statement)
        return int(result or 0)

    def update_conversation(
        self,
        conversation: Conversation,
    ) -> Conversation:
        """Update a conversation."""
        self._db.add(conversation)
        self._db.commit()
        self._db.refresh(conversation)
        return conversation

    def delete_conversation(
        self,
        conversation: Conversation,
    ) -> None:
        """Delete a conversation."""
        self._db.delete(conversation)
        self._db.commit()

    def add_message(
        self,
        message: ConversationMessage,
    ) -> ConversationMessage:
        """Add a message to a conversation."""
        self._db.add(message)
        self._db.commit()
        self._db.refresh(message)
        return message

    def get_message(
        self,
        message_id: UUID,
    ) -> ConversationMessage | None:
        """Retrieve a message by ID."""
        statement = select(ConversationMessage).where(
            ConversationMessage.id == message_id,
        )
        return self._db.scalar(statement)

    def list_messages(
        self,
        conversation_id: UUID,
    ) -> list[ConversationMessage]:
        """List messages in a conversation."""
        statement = (
            select(ConversationMessage)
            .where(
                ConversationMessage.conversation_id == conversation_id,
            )
            .order_by(ConversationMessage.created_at.asc())
        )
        return list(self._db.scalars(statement).all())

    def delete_message(
        self,
        message: ConversationMessage,
    ) -> None:
        """Delete a message."""
        self._db.delete(message)
        self._db.commit()

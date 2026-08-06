"""Dependencies for AI chat."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.chat.repository import ConversationRepository
from app.ai.chat.service import ConversationService
from app.database.dependencies import get_db


def get_conversation_repository(
    db: Annotated[Session, Depends(get_db)],
) -> ConversationRepository:
    """Create a conversation repository.

    Args:
        db: Database session.

    Returns:
        Conversation repository.
    """
    return ConversationRepository(db)


def get_conversation_service(
    repository: Annotated[
        ConversationRepository,
        Depends(get_conversation_repository),
    ],
) -> ConversationService:
    """Create a conversation service.

    Args:
        repository: Conversation repository.

    Returns:
        Conversation service.
    """
    return ConversationService(repository)

"""Tests for AI chat repository."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import uuid4

from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.repository import ConversationRepository


def test_repository_initialization() -> None:
    """Repository initializes successfully."""
    session = MagicMock()

    repository = ConversationRepository(session)

    assert repository._db is session


def test_create_conversation() -> None:
    """Create conversation."""
    session = MagicMock()

    repository = ConversationRepository(session)

    conversation = MagicMock(spec=Conversation)

    result = repository.create_conversation(conversation)

    session.add.assert_called_once_with(conversation)
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(conversation)

    assert result is conversation


def test_add_message() -> None:
    """Add conversation message."""
    session = MagicMock()

    repository = ConversationRepository(session)

    message = MagicMock(spec=ConversationMessage)

    result = repository.add_message(message)

    session.add.assert_called_once_with(message)
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(message)

    assert result is message


def test_get_conversation_not_found() -> None:
    """Conversation not found."""
    session = MagicMock()

    session.scalar.return_value = None

    repository = ConversationRepository(session)

    assert repository.get_conversation(uuid4()) is None


def test_get_message_not_found() -> None:
    """Message not found."""
    session = MagicMock()

    session.scalar.return_value = None

    repository = ConversationRepository(session)

    assert repository.get_message(uuid4()) is None

"""Tests for the AI chat service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.ai.chat.constants import ConversationStatus
from app.ai.chat.exceptions import (
    ChatGenerationError,
    ConversationArchivedError,
    ConversationClosedError,
    ConversationNotFoundError,
    ConversationPermissionDeniedError,
)
from app.ai.chat.models import Conversation
from app.ai.chat.repository import ConversationRepository
from app.ai.chat.schemas import ChatRequest, ConversationUpdate
from app.ai.chat.service import ConversationService
from app.ai.constants import AIModel, AIProvider
from app.models.organization import Organization
from app.models.user import User


def build_service(db_session: Session) -> ConversationService:
    """Build a conversation service with a real repository."""
    return ConversationService(ConversationRepository(db_session))


def create_conversation(
    service: ConversationService,
    organization: Organization,
    user: User,
    **overrides: object,
) -> Conversation:
    """Create and persist a conversation."""
    data: dict[str, object] = {
        "organization_id": organization.id,
        "created_by": user.id,
        "title": "Test Conversation",
        "provider": AIProvider.MOCK.value,
        "model": AIModel.GPT_4_1.value,
        "status": ConversationStatus.ACTIVE,
    }
    data.update(overrides)

    return service.create_conversation(Conversation(**data))


def test_create_and_get_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create and retrieve a conversation as its owner."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    result = service.get_conversation(conversation.id, organization.id, user.id)

    assert result.id == conversation.id


def test_get_conversation_not_found(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Raise conversation not found."""
    service = build_service(db_session)

    with pytest.raises(ConversationNotFoundError):
        service.get_conversation(uuid4(), organization.id, user.id)


def test_get_conversation_rejects_non_owner(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Raise permission denied for a user who did not create the conversation."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    with pytest.raises(ConversationPermissionDeniedError):
        service.get_conversation(conversation.id, organization.id, uuid4())


def test_get_conversation_isolated_from_other_organization(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """A conversation is invisible when queried under another organization."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    with pytest.raises(ConversationNotFoundError):
        service.get_conversation(conversation.id, uuid4(), user.id)


def test_list_conversations_with_message_counts(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List conversations with per-conversation message counts."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    service.send_message(
        ChatRequest(conversation_id=conversation.id, message="Hello"),
        organization.id,
        user.id,
    )

    conversations, total, counts = service.list_conversations(
        organization.id,
        user.id,
    )

    assert total == 1
    assert len(conversations) == 1
    assert counts[conversation.id] == 2


def test_update_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a conversation as its owner."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    updated = service.update_conversation(
        conversation.id,
        organization.id,
        user.id,
        ConversationUpdate(title="Renamed"),
    )

    assert updated.title == "Renamed"


def test_update_conversation_rejects_non_owner(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject updates from a user who did not create the conversation."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    with pytest.raises(ConversationPermissionDeniedError):
        service.update_conversation(
            conversation.id,
            organization.id,
            uuid4(),
            ConversationUpdate(title="Hijacked"),
        )


def test_delete_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Delete a conversation as its owner."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    service.delete_conversation(conversation.id, organization.id, user.id)

    with pytest.raises(ConversationNotFoundError):
        service.get_conversation(conversation.id, organization.id, user.id)


def test_send_message_returns_real_mock_response(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Send a message through the real mock AI provider."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    response = service.send_message(
        ChatRequest(conversation_id=conversation.id, message="Hello"),
        organization.id,
        user.id,
    )

    assert response.user_message.content == "Hello"
    assert response.assistant_message.content == "Mock AI response."
    assert response.assistant_message.token_count == 25


def test_send_message_rejects_non_owner(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject sending a message on a conversation owned by someone else."""
    service = build_service(db_session)

    conversation = create_conversation(service, organization, user)

    with pytest.raises(ConversationPermissionDeniedError):
        service.send_message(
            ChatRequest(conversation_id=conversation.id, message="Hello"),
            organization.id,
            uuid4(),
        )


def test_send_message_rejects_closed_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject sending a message on a closed conversation."""
    service = build_service(db_session)

    conversation = create_conversation(
        service,
        organization,
        user,
        status=ConversationStatus.CLOSED,
    )

    with pytest.raises(ConversationClosedError):
        service.send_message(
            ChatRequest(conversation_id=conversation.id, message="Hello"),
            organization.id,
            user.id,
        )


def test_send_message_rejects_archived_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject sending a message on an archived conversation."""
    service = build_service(db_session)

    conversation = create_conversation(
        service,
        organization,
        user,
        status=ConversationStatus.ARCHIVED,
    )

    with pytest.raises(ConversationArchivedError):
        service.send_message(
            ChatRequest(conversation_id=conversation.id, message="Hello"),
            organization.id,
            user.id,
        )


def test_send_message_wraps_unimplemented_provider(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Wrap an unimplemented provider's error as a chat generation error."""
    service = build_service(db_session)

    conversation = create_conversation(
        service,
        organization,
        user,
        provider=AIProvider.ANTHROPIC.value,
    )

    with pytest.raises(ChatGenerationError):
        service.send_message(
            ChatRequest(conversation_id=conversation.id, message="Hello"),
            organization.id,
            user.id,
        )

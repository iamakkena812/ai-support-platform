"""Tests for the AI chat repository."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.ai.chat.constants import ConversationStatus, MessageStatus, MessageType
from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.repository import ConversationRepository
from app.ai.constants import AIModel, AIProvider
from app.models.organization import Organization
from app.models.user import User


def build_conversation(
    organization: Organization,
    user: User,
    **overrides: object,
) -> Conversation:
    """Build a conversation instance."""
    data: dict[str, object] = {
        "organization_id": organization.id,
        "created_by": user.id,
        "title": "Test Conversation",
        "provider": AIProvider.MOCK.value,
        "model": AIModel.GPT_4_1.value,
        "status": ConversationStatus.ACTIVE,
    }
    data.update(overrides)

    return Conversation(**data)


def build_message(
    conversation: Conversation,
    *,
    role: MessageType = MessageType.USER,
    content: str = "Hello",
) -> ConversationMessage:
    """Build a conversation message instance."""
    return ConversationMessage(
        conversation_id=conversation.id,
        role=role,
        content=content,
        token_count=0,
        status=MessageStatus.COMPLETED,
    )


def test_create_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create a conversation."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    assert conversation.id is not None
    assert conversation.title == "Test Conversation"


def test_get_conversation_scoped_to_organization(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Get a conversation scoped to its organization."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    result = repository.get_conversation(conversation.id, organization.id)

    assert result is not None
    assert result.id == conversation.id

    other_org_result = repository.get_conversation(conversation.id, uuid4())

    assert other_org_result is None


def test_get_missing_conversation(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return None for a missing conversation."""
    repository = ConversationRepository(db_session)

    assert repository.get_conversation(uuid4(), organization.id) is None


def test_list_conversations_scoped_to_creator(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List conversations scoped to organization and creator."""
    repository = ConversationRepository(db_session)

    repository.create_conversation(build_conversation(organization, user))

    results = repository.list_conversations(organization.id, user.id)

    assert len(results) == 1

    other_creator_results = repository.list_conversations(
        organization.id,
        uuid4(),
    )

    assert other_creator_results == []


def test_count_conversations(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Count conversations scoped to organization and creator."""
    repository = ConversationRepository(db_session)

    for index in range(3):
        repository.create_conversation(
            build_conversation(organization, user, title=f"Conversation {index}"),
        )

    assert repository.count_conversations(organization.id, user.id) == 3


def test_update_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a conversation."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    conversation.title = "Updated Conversation"

    updated = repository.update_conversation(conversation)

    assert updated.title == "Updated Conversation"


def test_delete_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Delete a conversation."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    repository.delete_conversation(conversation)

    assert repository.get_conversation(conversation.id, organization.id) is None


def test_add_and_list_messages(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Add and list conversation messages in order."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    repository.add_message(
        build_message(conversation, role=MessageType.USER, content="Hi"),
    )
    repository.add_message(
        build_message(
            conversation,
            role=MessageType.ASSISTANT,
            content="Hello!",
        ),
    )

    messages = repository.list_messages(conversation.id)

    assert len(messages) == 2
    assert messages[0].role == MessageType.USER
    assert messages[1].role == MessageType.ASSISTANT


def test_count_messages_by_conversation(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Count messages grouped by conversation."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    repository.add_message(build_message(conversation))

    counts = repository.count_messages_by_conversation([conversation.id])

    assert counts[conversation.id] == 1
    assert repository.count_messages_by_conversation([]) == {}


def test_get_message(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Get a message by ID."""
    repository = ConversationRepository(db_session)

    conversation = repository.create_conversation(
        build_conversation(organization, user),
    )

    message = repository.add_message(build_message(conversation))

    result = repository.get_message(message.id)

    assert result is not None
    assert result.id == message.id
    assert repository.get_message(uuid4()) is None

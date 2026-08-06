"""Tests for AI chat service."""

from __future__ import annotations

from datetime import UTC, datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from app.ai.chat.constants import ConversationStatus
from app.ai.chat.exceptions import ConversationNotFoundError
from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.schemas import ChatRequest
from app.ai.chat.service import ConversationService
from app.ai.constants import AIModel, AIProvider, PromptRole
from app.ai.schemas import AIResponse, PromptMessage, TokenUsage


@pytest.fixture
def conversation() -> Conversation:
    """Create a conversation."""
    now = datetime.now(UTC)

    return Conversation(
        id=uuid4(),
        organization_id=uuid4(),
        customer_id=None,
        ticket_id=None,
        created_by=uuid4(),
        title="AI Chat",
        provider=AIProvider.MOCK.value,
        model=AIModel.GPT_4_1.value,
        status=ConversationStatus.ACTIVE,
        created_at=now,
        updated_at=now,
    )


@pytest.fixture
def repository() -> MagicMock:
    """Create repository mock."""
    return MagicMock()


@pytest.fixture
def service(
    repository: MagicMock,
) -> ConversationService:
    """Create conversation service."""
    return ConversationService(
        repository,
    )


def test_send_message(
    monkeypatch: pytest.MonkeyPatch,
    service: ConversationService,
    repository: MagicMock,
    conversation: Conversation,
) -> None:
    """Test sending a message."""
    repository.get_conversation.return_value = conversation

    # Support either implementation
    repository.list_messages.return_value = []
    repository.get_history.return_value = []

    def add_message(
        message: ConversationMessage,
    ) -> ConversationMessage:
        """Mock repository.add_message()."""
        if message.id is None:
            message.id = uuid4()

        if message.created_at is None:
            message.created_at = datetime.now(UTC)

        message.conversation_id = conversation.id

        return message

    repository.add_message.side_effect = add_message

    fake_prompt = [
        PromptMessage(
            role=PromptRole.USER,
            content="Hello",
        ),
    ]

    class FakePromptBuilder:
        """Prompt builder."""

        @staticmethod
        def build_chat_prompt(
            history: list[ConversationMessage],
            message: str,
        ) -> list[PromptMessage]:
            return fake_prompt

    monkeypatch.setattr(
        "app.ai.chat.service.PromptBuilder",
        FakePromptBuilder,
    )

    fake_provider = MagicMock()

    fake_provider.generate.return_value = AIResponse(
        provider=AIProvider.OPENAI,
        model=AIModel.GPT_4_1,
        content="Hello from AI",
        usage=TokenUsage(
            prompt_tokens=10,
            completion_tokens=20,
            total_tokens=30,
        ),
    )

    monkeypatch.setattr(
        "app.ai.chat.service.get_provider",
        lambda _: fake_provider,
    )

    request = ChatRequest(
        conversation_id=conversation.id,
        message="Hello",
    )

    response = service.send_message(
        request,
    )

    assert response.user_message.content == "Hello"
    assert response.assistant_message.content == "Hello from AI"

    assert repository.add_message.call_count == 2
    fake_provider.generate.assert_called_once()


def test_send_message_conversation_not_found(
    service: ConversationService,
    repository: MagicMock,
) -> None:
    """Conversation does not exist."""
    repository.get_conversation.return_value = None

    with pytest.raises(ConversationNotFoundError):
        service.send_message(
            ChatRequest(
                conversation_id=uuid4(),
                message="Hello",
            ),
        )

"""Service for AI chat."""

from __future__ import annotations

import time
from uuid import UUID

from app.ai.chat.constants import ConversationStatus, MessageStatus, MessageType
from app.ai.chat.exceptions import (
    ConversationArchivedError,
    ConversationClosedError,
    ConversationNotFoundError,
)
from app.ai.chat.mappers.chat import ChatMapper
from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.prompts.builder import PromptBuilder
from app.ai.chat.repository import ConversationRepository
from app.ai.chat.schemas import (
    ChatRequest,
    ChatResponse,
    ConversationUpdate,
)
from app.ai.constants import AIModel, AIProvider
from app.ai.providers.registry import get_provider
from app.ai.schemas import AIRequest


class ConversationService:
    """Service for AI conversations."""

    def __init__(
        self,
        repository: ConversationRepository,
    ) -> None:
        """Initialize the service.

        Args:
            repository: Conversation repository.
        """
        self._repository = repository

    def create_conversation(
        self,
        conversation: Conversation,
    ) -> Conversation:
        """Create a conversation."""
        return self._repository.create_conversation(
            conversation,
        )

    def get_conversation(
        self,
        conversation_id: UUID,
    ) -> Conversation:
        """Retrieve a conversation."""
        conversation = self._repository.get_conversation(
            conversation_id,
        )

        if conversation is None:
            raise ConversationNotFoundError(
                str(conversation_id),
            )

        return conversation

    def list_conversations(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[list[Conversation], int]:
        """List conversations."""
        conversations = self._repository.list_conversations(
            organization_id,
            offset=offset,
            limit=limit,
        )

        total = self._repository.count_conversations(
            organization_id,
        )

        return conversations, total

    def update_conversation(
        self,
        conversation_id: UUID,
        update: ConversationUpdate,
    ) -> Conversation:
        """Update a conversation."""
        conversation = self.get_conversation(
            conversation_id,
        )

        if update.title is not None:
            conversation.title = update.title

        if update.status is not None:
            conversation.status = update.status

        return self._repository.update_conversation(
            conversation,
        )

    def archive_conversation(
        self,
        conversation_id: UUID,
    ) -> Conversation:
        """Archive a conversation."""
        conversation = self.get_conversation(
            conversation_id,
        )

        conversation.status = ConversationStatus.ARCHIVED

        return self._repository.update_conversation(
            conversation,
        )

    def close_conversation(
        self,
        conversation_id: UUID,
    ) -> Conversation:
        """Close a conversation."""
        conversation = self.get_conversation(
            conversation_id,
        )

        conversation.status = ConversationStatus.CLOSED

        return self._repository.update_conversation(
            conversation,
        )

    def delete_conversation(
        self,
        conversation_id: UUID,
    ) -> None:
        """Delete a conversation."""
        conversation = self.get_conversation(
            conversation_id,
        )

        self._repository.delete_conversation(
            conversation,
        )

    def add_message(
        self,
        conversation_id: UUID,
        message: ConversationMessage,
    ) -> ConversationMessage:
        """Add a message to a conversation."""
        conversation = self.get_conversation(
            conversation_id,
        )

        if conversation.status == ConversationStatus.CLOSED:
            raise ConversationClosedError(
                str(conversation.id),
            )

        if conversation.status == ConversationStatus.ARCHIVED:
            raise ConversationArchivedError(
                str(conversation.id),
            )

        message.conversation_id = conversation.id

        return self._repository.add_message(
            message,
        )

    def get_history(
        self,
        conversation_id: UUID,
    ) -> list[ConversationMessage]:
        """Return conversation history."""
        self.get_conversation(
            conversation_id,
        )

        return self._repository.list_messages(
            conversation_id,
        )

    def send_message(
        self,
        request: ChatRequest,
    ) -> ChatResponse:
        """Send a message to the configured AI provider.

        Args:
            request: Chat request.

        Returns:
            AI chat response.
        """
        conversation = self.get_conversation(
            request.conversation_id,
        )

        history = self.get_history(
            conversation.id,
        )

        prompt = PromptBuilder.build_chat_prompt(
            history=history,
            message=request.message,
        )

        provider = get_provider(
            AIProvider(conversation.provider),
        )

        ai_request = AIRequest(
            provider=AIProvider(conversation.provider),
            model=AIModel(conversation.model),
            messages=prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=request.stream,
        )

        start = time.perf_counter()

        ai_response = provider.generate(
            ai_request,
        )

        latency_ms = int(
            (time.perf_counter() - start) * 1000,
        )

        user_message = self.add_message(
            conversation.id,
            ConversationMessage(
                conversation_id=conversation.id,
                role=MessageType.USER,
                content=request.message,
                token_count=0,
                latency_ms=None,
                status=MessageStatus.COMPLETED,
            ),
        )

        assistant_message = self.add_message(
            conversation.id,
            ConversationMessage(
                conversation_id=conversation.id,
                role=MessageType.ASSISTANT,
                content=ai_response.content,
                token_count=ai_response.usage.total_tokens,
                latency_ms=latency_ms,
                status=MessageStatus.COMPLETED,
            ),
        )

        return ChatMapper.build_chat_response(
            conversation=conversation,
            user_message=user_message,
            assistant_message=assistant_message,
        )

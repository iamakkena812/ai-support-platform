"""Chat mapper."""

from __future__ import annotations

from app.ai.chat.constants import MessageType
from app.ai.chat.models import Conversation, ConversationMessage
from app.ai.chat.schemas import ChatResponse, ConversationResponse, MessageResponse
from app.ai.constants import PromptRole
from app.ai.schemas import AIResponse, PromptMessage


class ChatMapper:
    """Mapper for AI chat."""

    @staticmethod
    def to_provider_messages(
        messages: list[ConversationMessage],
    ) -> list[PromptMessage]:
        """Convert conversation history into provider prompt messages."""
        return [
            PromptMessage(
                role=(
                    PromptRole.USER
                    if message.role == MessageType.USER
                    else PromptRole.ASSISTANT
                ),
                content=message.content,
            )
            for message in messages
        ]

    @staticmethod
    def from_provider_response(
        response: AIResponse,
    ) -> ConversationMessage:
        """Convert provider response into a conversation message."""
        return ConversationMessage(
            role=MessageType.ASSISTANT,
            content=response.content,
            token_count=response.usage.total_tokens,
            # latency_ms is populated by ConversationService
            # after timing the provider call.
        )

    @staticmethod
    def conversation_response(
        conversation: Conversation,
    ) -> ConversationResponse:
        """Convert conversation model to response schema."""
        return ConversationResponse.model_validate(
            conversation,
        )

    @staticmethod
    def message_response(
        message: ConversationMessage,
    ) -> MessageResponse:
        """Convert message model to response schema."""
        return MessageResponse.model_validate(
            message,
        )

    @classmethod
    def build_chat_response(
        cls,
        conversation: Conversation,
        user_message: ConversationMessage,
        assistant_message: ConversationMessage,
    ) -> ChatResponse:
        """Build chat response."""
        return ChatResponse(
            conversation=cls.conversation_response(
                conversation,
            ),
            user_message=cls.message_response(
                user_message,
            ),
            assistant_message=cls.message_response(
                assistant_message,
            ),
        )

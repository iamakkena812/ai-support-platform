"""openai mapper for AI."""

from __future__ import annotations

from openai.types.chat import (
    ChatCompletionAssistantMessageParam,
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
)

from app.ai.constants import PromptRole
from app.ai.schemas import PromptMessage


class OpenAIMessageMapper:
    """Maps prompt messages to OpenAI SDK messages."""

    @staticmethod
    def build(
        messages: list[PromptMessage],
    ) -> list[ChatCompletionMessageParam]:
        """Convert prompt messages."""
        result: list[ChatCompletionMessageParam] = []

        for message in messages:
            match message.role:
                case PromptRole.SYSTEM:
                    result.append(
                        ChatCompletionSystemMessageParam(
                            role="system",
                            content=message.content,
                        ),
                    )

                case PromptRole.USER:
                    result.append(
                        ChatCompletionUserMessageParam(
                            role="user",
                            content=message.content,
                        ),
                    )

                case PromptRole.ASSISTANT:
                    result.append(
                        ChatCompletionAssistantMessageParam(
                            role="assistant",
                            content=message.content,
                        ),
                    )

        return result

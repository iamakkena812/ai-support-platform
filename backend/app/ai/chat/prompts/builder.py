"""Prompt builder."""

from __future__ import annotations

from app.ai.chat.constants import MessageType
from app.ai.chat.models import ConversationMessage
from app.ai.chat.prompts.system import SystemPrompts
from app.ai.constants import PromptRole
from app.ai.schemas import PromptMessage


class PromptBuilder:
    """Build provider-independent prompts."""

    @staticmethod
    def build_chat_prompt(
        history: list[ConversationMessage],
        message: str,
    ) -> list[PromptMessage]:
        """Build chat prompt.

        Args:
            history: Previous conversation messages.
            message: Current user message.

        Returns:
            Provider-independent prompt messages.
        """
        prompt: list[PromptMessage] = [
            PromptMessage(
                role=PromptRole.SYSTEM,
                content=SystemPrompts.DEFAULT,
            ),
        ]

        for item in history:
            prompt.append(
                PromptMessage(
                    role=(
                        PromptRole.USER
                        if item.role == MessageType.USER
                        else PromptRole.ASSISTANT
                    ),
                    content=item.content,
                ),
            )

        prompt.append(
            PromptMessage(
                role=PromptRole.USER,
                content=message,
            ),
        )

        return prompt

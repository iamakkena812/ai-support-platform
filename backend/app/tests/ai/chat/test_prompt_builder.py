"""Tests for the AI chat prompt builder."""

from __future__ import annotations

from app.ai.chat.constants import MessageStatus, MessageType
from app.ai.chat.models import ConversationMessage
from app.ai.chat.prompts.builder import PromptBuilder
from app.ai.chat.prompts.system import SystemPrompts
from app.ai.constants import PromptRole


def build_history_message(
    role: MessageType,
    content: str,
) -> ConversationMessage:
    """Build a conversation message for prompt history."""
    return ConversationMessage(
        role=role,
        content=content,
        token_count=0,
        status=MessageStatus.COMPLETED,
    )


def test_build_chat_prompt_starts_with_system_prompt() -> None:
    """The prompt always begins with the default system prompt."""
    prompt = PromptBuilder.build_chat_prompt(history=[], message="Hi")

    assert prompt[0].role == PromptRole.SYSTEM
    assert prompt[0].content == SystemPrompts.DEFAULT


def test_build_chat_prompt_appends_the_current_message() -> None:
    """The current user message is appended last."""
    prompt = PromptBuilder.build_chat_prompt(history=[], message="Hello there")

    assert prompt[-1].role == PromptRole.USER
    assert prompt[-1].content == "Hello there"


def test_build_chat_prompt_includes_history_in_order() -> None:
    """Prior history messages are translated and preserved in order."""
    history = [
        build_history_message(MessageType.USER, "First question"),
        build_history_message(MessageType.ASSISTANT, "First answer"),
    ]

    prompt = PromptBuilder.build_chat_prompt(history=history, message="Follow-up")

    assert [message.content for message in prompt] == [
        SystemPrompts.DEFAULT,
        "First question",
        "First answer",
        "Follow-up",
    ]
    assert prompt[1].role == PromptRole.USER
    assert prompt[2].role == PromptRole.ASSISTANT


def test_build_chat_prompt_maps_system_history_to_assistant_role() -> None:
    """Non-user history roles (e.g. system) map to the assistant prompt role."""
    history = [build_history_message(MessageType.SYSTEM, "A system note")]

    prompt = PromptBuilder.build_chat_prompt(history=history, message="Hi")

    assert prompt[1].role == PromptRole.ASSISTANT

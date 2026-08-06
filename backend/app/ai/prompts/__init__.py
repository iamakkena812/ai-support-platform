"""Prompts providers for AI."""

from __future__ import annotations

from app.ai.constants import PromptRole
from app.ai.schemas import PromptMessage


class PromptLibrary:
    """Reusable system prompts for AI operations."""

    @staticmethod
    def system() -> PromptMessage:
        """Return the default system prompt."""
        return PromptMessage(
            role=PromptRole.SYSTEM,
            content=(
                "You are an enterprise AI assistant. "
                "Provide accurate, concise, professional responses."
            ),
        )

    @staticmethod
    def support_assistant() -> PromptMessage:
        """Return the support assistant prompt."""
        return PromptMessage(
            role=PromptRole.SYSTEM,
            content=(
                "You are an AI customer support assistant. "
                "Help users troubleshoot issues, explain solutions, "
                "and provide clear step-by-step guidance."
            ),
        )

    @staticmethod
    def summarizer() -> PromptMessage:
        """Return the text summarization prompt."""
        return PromptMessage(
            role=PromptRole.SYSTEM,
            content=(
                "Summarize the provided content while preserving "
                "the key technical and business information."
            ),
        )

    @staticmethod
    def classifier() -> PromptMessage:
        """Return the classification prompt."""
        return PromptMessage(
            role=PromptRole.SYSTEM,
            content=(
                "Classify the input into the most appropriate category. "
                "Return only the category name."
            ),
        )

    @staticmethod
    def translator() -> PromptMessage:
        """Return the translation prompt."""
        return PromptMessage(
            role=PromptRole.SYSTEM,
            content=(
                "Translate the provided text while preserving "
                "its original meaning and tone."
            ),
        )

"""Usage mapper."""

from __future__ import annotations

from typing import Protocol

from app.ai.schemas import TokenUsage


class SupportsTokenUsage(Protocol):
    """Protocol for provider usage objects."""

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class UsageMapper:
    """Maps provider token usage."""

    @staticmethod
    def openai(
        usage: SupportsTokenUsage | None,
    ) -> TokenUsage:
        """Convert OpenAI usage."""
        if usage is None:
            return TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
            )

        return TokenUsage(
            prompt_tokens=usage.prompt_tokens,
            completion_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
        )

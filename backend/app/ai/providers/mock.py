"""Mock provider implementation."""

from __future__ import annotations

from collections.abc import AsyncIterator

from app.ai.providers.base import AIProvider
from app.ai.schemas import (
    AIRequest,
    AIResponse,
    TokenUsage,
)


class MockAIProvider(AIProvider):
    """Mock AI provider used for development and testing."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "mock"

    def health(self) -> bool:
        """Return provider health."""
        return True

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate a mock AI response."""
        return AIResponse(
            provider=request.provider,
            model=request.model,
            content="Mock AI response.",
            usage=TokenUsage(
                prompt_tokens=10,
                completion_tokens=15,
                total_tokens=25,
            ),
            finish_reason="stop",
        )

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream a mock AI response."""
        yield "Mock"
        yield " "
        yield "AI"
        yield " "
        yield "response."

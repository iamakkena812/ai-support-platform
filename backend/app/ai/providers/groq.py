"""GroqProvider provider implementations."""

from __future__ import annotations

from collections.abc import AsyncIterator

from app.ai.providers.base import AIProvider
from app.ai.schemas import AIRequest, AIResponse


class GroqProvider(AIProvider):
    """Groq provider."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "groq"

    def health(self) -> bool:
        """Return provider health."""
        return False

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate a response using Groq."""
        raise NotImplementedError("Groq provider is not implemented yet.")

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream an AI response."""
        if False:
            yield ""

        raise NotImplementedError(
            "Groq streaming is not implemented yet.",
        )

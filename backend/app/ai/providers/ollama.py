"""Ollama provider implementations."""

from __future__ import annotations

from collections.abc import AsyncIterator

from app.ai.providers.base import AIProvider
from app.ai.schemas import AIRequest, AIResponse


class OllamaProvider(AIProvider):
    """Ollama provider."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "ollama"

    def health(self) -> bool:
        """Return the provider health status."""
        return False

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate an AI response."""
        raise NotImplementedError("Ollama provider is not implemented yet.")

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream an AI response."""
        if False:
            yield ""

        raise NotImplementedError(
            "Ollama streaming is not implemented yet.",
        )

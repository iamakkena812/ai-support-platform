"""Base provider implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

from app.ai.schemas import (
    AIRequest,
    AIResponse,
)


class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate a response from the AI provider."""
        raise NotImplementedError

    @abstractmethod
    def health(self) -> bool:
        """Return provider health status."""
        raise NotImplementedError

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the provider name."""
        raise NotImplementedError

    @abstractmethod
    def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream an AI response."""
        raise NotImplementedError

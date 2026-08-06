"""llm providers for AI."""

from __future__ import annotations

from app.ai.constants import AIProvider
from app.ai.providers.base import AIProvider as BaseProvider
from app.ai.providers.registry import get_provider


class LLM:
    """LLM provider factory."""

    @staticmethod
    def get_provider(provider: AIProvider) -> BaseProvider:
        """Return the configured provider."""
        return get_provider(provider)

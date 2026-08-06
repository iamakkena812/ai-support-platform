"""Tests for AI provider registry."""

from __future__ import annotations

from typing import cast

import pytest
from app.ai.constants import AIProvider
from app.ai.exceptions import AIProviderError
from app.ai.providers.base import AIProvider as BaseProvider
from app.ai.providers.registry import get_provider


@pytest.mark.parametrize(
    "provider",
    [
        AIProvider.MOCK,
        AIProvider.OPENAI,
        AIProvider.ANTHROPIC,
        AIProvider.GEMINI,
        AIProvider.GROQ,
        AIProvider.OLLAMA,
        AIProvider.AZURE_OPENAI,
    ],
)
def test_get_provider(provider: AIProvider) -> None:
    """Return the correct provider instance."""
    instance = get_provider(provider)

    assert isinstance(instance, BaseProvider)


def test_invalid_provider() -> None:
    """Raise an error for an unsupported provider."""
    invalid_provider = cast(AIProvider, "invalid")

    with pytest.raises(AIProviderError):
        get_provider(invalid_provider)

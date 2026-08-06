"""Registry for AI providers."""

from __future__ import annotations

from collections.abc import Callable
from typing import Final

from app.ai.constants import AIProvider as AIProviderType
from app.ai.exceptions import AIProviderError
from app.ai.providers.anthropic import AnthropicProvider
from app.ai.providers.azure_openai import AzureOpenAIProvider
from app.ai.providers.base import AIProvider as BaseProvider
from app.ai.providers.gemini import GeminiProvider
from app.ai.providers.groq import GroqProvider
from app.ai.providers.mock import MockAIProvider
from app.ai.providers.ollama import OllamaProvider
from app.ai.providers.openai import OpenAIProvider

ProviderFactory = Callable[[], BaseProvider]

_PROVIDER_REGISTRY: Final[dict[AIProviderType, ProviderFactory]] = {
    AIProviderType.MOCK: MockAIProvider,
    AIProviderType.OPENAI: OpenAIProvider,
    AIProviderType.ANTHROPIC: AnthropicProvider,
    AIProviderType.GEMINI: GeminiProvider,
    AIProviderType.GROQ: GroqProvider,
    AIProviderType.OLLAMA: OllamaProvider,
    AIProviderType.AZURE_OPENAI: AzureOpenAIProvider,
}


def get_provider(
    provider: AIProviderType,
) -> BaseProvider:
    """Return an initialized AI provider."""
    try:
        factory = _PROVIDER_REGISTRY[provider]
    except KeyError as exc:
        raise AIProviderError(
            f"Unsupported AI provider: {provider!s}",
        ) from exc

    return factory()

"""Service layer for AI."""

from __future__ import annotations

from collections.abc import AsyncIterator
from datetime import UTC, datetime

from app.ai.constants import AIModel, AIProvider
from app.ai.providers.base import AIProvider as BaseAIProvider
from app.ai.providers.llm import LLM
from app.ai.providers.repository import AIRepository
from app.ai.schemas import (
    AIConfiguration,
    AIHealth,
    AIRequest,
    AIResponse,
)


class AIService:
    """Service layer for AI operations."""

    def __init__(
        self,
        repository: AIRepository,
    ) -> None:
        """Initialize the AI service."""
        self._repository = repository
        self._llm = LLM()

    def _get_provider(
        self,
        provider: AIProvider,
    ) -> BaseAIProvider:
        """Return the requested AI provider."""
        return self._llm.get_provider(provider)

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate an AI response."""
        provider = self._get_provider(request.provider)
        return provider.generate(request)

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream an AI response."""
        provider = self._get_provider(request.provider)

        async for token in provider.stream(request):
            yield token

    def health(self) -> AIHealth:
        """Return AI module health."""
        configuration = self._repository.get_configuration()

        return AIHealth(
            status="healthy",
            providers=[
                AIProvider.OPENAI,
                AIProvider.ANTHROPIC,
                AIProvider.GEMINI,
                AIProvider.AZURE_OPENAI,
                AIProvider.OLLAMA,
                AIProvider.LMSTUDIO,
                AIProvider.MOCK,
            ],
            default_provider=configuration.default_provider,
            available_models=[
                AIModel.GPT_4_1,
                AIModel.GPT_4O,
                AIModel.GPT_4O_MINI,
                AIModel.CLAUDE_SONNET,
                AIModel.CLAUDE_OPUS,
                AIModel.GEMINI_PRO,
                AIModel.GEMINI_FLASH,
                AIModel.LLAMA3,
                AIModel.MISTRAL,
            ],
            checked_at=datetime.now(UTC),
        )

    def configuration(self) -> AIConfiguration:
        """Return the current AI configuration."""
        return self._repository.get_configuration()

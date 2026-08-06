"""Test Repository for AI."""

from __future__ import annotations

from app.ai.constants import (
    DEFAULT_MAX_TOKENS,
    DEFAULT_TEMPERATURE,
    DEFAULT_TIMEOUT_SECONDS,
    AIModel,
    AIProvider,
)
from app.ai.providers.repository import AIRepository
from app.ai.schemas import AIConfiguration


def test_get_configuration(
    ai_repository: AIRepository,
) -> None:
    """Test retrieving the default AI configuration."""
    configuration = ai_repository.get_configuration()

    assert isinstance(configuration, AIConfiguration)
    assert configuration.default_provider == AIProvider.OPENAI
    assert configuration.default_model == AIModel.GPT_4_1
    assert configuration.temperature == DEFAULT_TEMPERATURE
    assert configuration.max_tokens == DEFAULT_MAX_TOKENS
    assert configuration.timeout_seconds == DEFAULT_TIMEOUT_SECONDS


def test_repository_health(
    ai_repository: AIRepository,
) -> None:
    """Test repository health."""
    assert ai_repository.health() is True

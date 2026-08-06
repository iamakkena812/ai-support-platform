"""Test services for AI."""

from __future__ import annotations

from app.ai.constants import (
    AIModel,
    AIProvider,
    AIRequestType,
    PromptRole,
)
from app.ai.providers.service import AIService
from app.ai.schemas import (
    AIConfiguration,
    AIHealth,
    AIRequest,
    AIResponse,
    PromptMessage,
)


def test_generate(
    ai_service: AIService,
) -> None:
    """Test AI response generation."""
    request = AIRequest(
        provider=AIProvider.MOCK,
        model=AIModel.GPT_4_1,
        request_type=AIRequestType.CHAT,
        messages=[
            PromptMessage(
                role=PromptRole.USER,
                content="Hello",
            ),
        ],
        temperature=0.2,
        max_tokens=256,
        stream=False,
    )

    response = ai_service.generate(request)

    assert isinstance(response, AIResponse)
    assert response.provider == AIProvider.MOCK
    assert response.model == AIModel.GPT_4_1
    assert response.content == "Mock AI response."
    assert response.usage.total_tokens == 25


def test_health(
    ai_service: AIService,
) -> None:
    """Test AI health."""
    health = ai_service.health()

    assert isinstance(health, AIHealth)
    assert health.status == "healthy"
    assert health.default_provider == AIProvider.OPENAI
    assert len(health.providers) > 0
    assert len(health.available_models) > 0


def test_configuration(
    ai_service: AIService,
) -> None:
    """Test AI configuration."""
    configuration = ai_service.configuration()

    assert isinstance(configuration, AIConfiguration)
    assert configuration.default_provider == AIProvider.OPENAI
    assert configuration.default_model == AIModel.GPT_4_1

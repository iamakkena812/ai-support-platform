"""Test Provider for AI."""

from __future__ import annotations

from app.ai.constants import (
    AIModel,
    AIProvider,
    AIRequestType,
    PromptRole,
)
from app.ai.providers import MockAIProvider
from app.ai.schemas import (
    AIRequest,
    AIResponse,
    PromptMessage,
    TokenUsage,
)


def test_mock_provider_generate() -> None:
    """Test mock AI provider."""
    provider = MockAIProvider()

    request = AIRequest(
        provider=AIProvider.MOCK,
        model=AIModel.GPT_4_1,
        request_type=AIRequestType.CHAT,
        messages=[
            PromptMessage(
                role=PromptRole.USER,
                content="Hello AI",
            ),
        ],
        temperature=0.2,
        max_tokens=256,
        stream=False,
    )

    response = provider.generate(request)

    assert isinstance(response, AIResponse)
    assert response.provider == AIProvider.MOCK
    assert response.model == AIModel.GPT_4_1
    assert response.content == "Mock AI response."
    assert isinstance(response.usage, TokenUsage)
    assert response.usage.prompt_tokens == 10
    assert response.usage.completion_tokens == 15
    assert response.usage.total_tokens == 25
    assert response.finish_reason == "stop"

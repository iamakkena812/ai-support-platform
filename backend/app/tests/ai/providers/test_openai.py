"""Tests for OpenAI provider."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from app.ai.constants import (
    AIModel,
    AIProvider,
    AIRequestType,
    PromptRole,
)
from app.ai.providers.openai import OpenAIProvider
from app.ai.schemas import (
    AIRequest,
    AIResponse,
    PromptMessage,
)
from openai.types.chat import (
    ChatCompletion,
    ChatCompletionMessage,
)
from openai.types.chat.chat_completion import Choice
from openai.types.completion_usage import CompletionUsage


@patch("app.ai.providers.openai.OpenAI")
def test_openai_provider_initialization(
    mock_openai: MagicMock,
) -> None:
    """Test OpenAI provider initialization."""
    provider = OpenAIProvider()

    assert provider.provider_name == "openai"
    assert provider.health() in (True, False)

    # Lazy initialization: no client should be created yet.
    mock_openai.assert_not_called()


@patch("app.ai.providers.openai.OpenAI")
def test_generate(
    mock_openai: MagicMock,
) -> None:
    """Test OpenAI response generation."""
    mock_client = MagicMock()
    mock_openai.return_value = mock_client

    mock_client.chat.completions.create.return_value = ChatCompletion(
        id="chatcmpl-test",
        object="chat.completion",
        created=0,
        model="gpt-4.1",
        choices=[
            Choice(
                index=0,
                finish_reason="stop",
                message=ChatCompletionMessage(
                    role="assistant",
                    content="Hello from OpenAI!",
                ),
            ),
        ],
        usage=CompletionUsage(
            prompt_tokens=10,
            completion_tokens=20,
            total_tokens=30,
        ),
    )

    provider = OpenAIProvider()

    request = AIRequest(
        provider=AIProvider.OPENAI,
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

    response = provider.generate(request)

    assert isinstance(response, AIResponse)
    assert response.provider == AIProvider.OPENAI
    assert response.model == AIModel.GPT_4_1
    assert response.content == "Hello from OpenAI!"
    assert response.usage.prompt_tokens == 10
    assert response.usage.completion_tokens == 20
    assert response.usage.total_tokens == 30
    assert response.finish_reason == "stop"

    # Client created lazily.
    mock_openai.assert_called_once()
    mock_client.chat.completions.create.assert_called_once()

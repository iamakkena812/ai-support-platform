"""Tests for streaming provider implementations."""

from __future__ import annotations

from collections.abc import AsyncIterator

import pytest
from app.ai.constants import (
    AIModel,
    AIProvider,
    AIRequestType,
    PromptRole,
)
from app.ai.providers.base import AIProvider as BaseProvider
from app.ai.schemas import (
    AIRequest,
    AIResponse,
    PromptMessage,
)


class MockStreamingProvider(BaseProvider):
    """Mock streaming provider for testing."""

    @property
    def provider_name(self) -> str:
        """Return provider name."""
        return "mock"

    def health(self) -> bool:
        """Return provider health."""
        return True

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate a response."""
        del request
        raise NotImplementedError(
            "MockStreamingProvider.generate() is not implemented.",
        )

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream mock tokens."""
        del request

        yield "Hello"
        yield " "
        yield "World"
        yield "!"


@pytest.fixture
def ai_request() -> AIRequest:
    """Create an AI request."""
    return AIRequest(
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
        max_tokens=100,
        stream=True,
    )


@pytest.mark.asyncio
async def test_stream_returns_tokens(
    ai_request: AIRequest,
) -> None:
    """Test streaming returns tokens in order."""
    provider = MockStreamingProvider()

    tokens: list[str] = []

    async for token in provider.stream(ai_request):
        tokens.append(token)

    assert tokens == [
        "Hello",
        " ",
        "World",
        "!",
    ]


@pytest.mark.asyncio
async def test_stream_joined_text(
    ai_request: AIRequest,
) -> None:
    """Test streamed text can be reconstructed."""
    provider = MockStreamingProvider()

    result = ""

    async for token in provider.stream(ai_request):
        result += token

    assert result == "Hello World!"


class EmptyProvider(MockStreamingProvider):
    """Empty streaming provider."""

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Return no tokens."""
        del request

        if False:
            yield ""


@pytest.mark.asyncio
async def test_empty_stream(
    ai_request: AIRequest,
) -> None:
    """Test an empty stream."""
    provider = EmptyProvider()

    tokens: list[str] = [token async for token in provider.stream(ai_request)]

    assert tokens == []


class SingleTokenProvider(MockStreamingProvider):
    """Single-token streaming provider."""

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Return one token."""
        del request
        yield "AI"


@pytest.mark.asyncio
async def test_single_token_stream(
    ai_request: AIRequest,
) -> None:
    """Test streaming a single token."""
    provider = SingleTokenProvider()

    tokens: list[str] = [token async for token in provider.stream(ai_request)]

    assert tokens == ["AI"]


@pytest.mark.asyncio
async def test_stream_iteration_count(
    ai_request: AIRequest,
) -> None:
    """Test streamed token count."""
    provider = MockStreamingProvider()

    count = 0

    async for _ in provider.stream(ai_request):
        count += 1

    assert count == 4

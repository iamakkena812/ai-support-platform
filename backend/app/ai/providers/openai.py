"""openai provider implementations."""

from __future__ import annotations

from collections.abc import AsyncIterator

from openai import (
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    OpenAI,
    RateLimitError,
)
from openai.types.chat import (
    ChatCompletionAssistantMessageParam,
    ChatCompletionDeveloperMessageParam,
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
)

from app.ai.constants import PromptRole
from app.ai.exceptions import (
    AIProviderError,
    ProviderAuthenticationError,
    RateLimitExceededError,
)
from app.ai.providers.base import AIProvider
from app.ai.schemas import (
    AIRequest,
    AIResponse,
    PromptMessage,
    TokenUsage,
)
from app.config.settings import settings


class OpenAIProvider(AIProvider):
    """OpenAI provider implementation."""

    def __init__(self) -> None:
        """Initialize the provider."""
        self._client: OpenAI | None = None

    def _get_client(self) -> OpenAI:
        """Return the OpenAI client."""
        if self._client is None:
            self._client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                organization=settings.OPENAI_ORGANIZATION or None,
                project=settings.OPENAI_PROJECT or None,
                base_url=settings.OPENAI_BASE_URL,
                timeout=settings.OPENAI_TIMEOUT,
            )

        return self._client

    @property
    def provider_name(self) -> str:
        """Return provider name."""
        return "openai"

    def health(self) -> bool:
        """Return provider health."""
        return bool(settings.OPENAI_API_KEY)

    def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        """Generate a response using OpenAI."""
        try:
            response = self._get_client().chat.completions.create(
                model=request.model.value,
                messages=self._build_messages(request.messages),
                temperature=request.temperature,
                max_completion_tokens=request.max_tokens,
            )

            usage = response.usage

            return AIResponse(
                provider=request.provider,
                model=request.model,
                content=response.choices[0].message.content or "",
                usage=TokenUsage(
                    prompt_tokens=usage.prompt_tokens if usage else 0,
                    completion_tokens=usage.completion_tokens if usage else 0,
                    total_tokens=usage.total_tokens if usage else 0,
                ),
                finish_reason=response.choices[0].finish_reason or "stop",
            )

        except AuthenticationError as exc:
            raise ProviderAuthenticationError(
                "OpenAI authentication failed.",
            ) from exc

        except RateLimitError as exc:
            raise RateLimitExceededError(
                "OpenAI rate limit exceeded.",
            ) from exc

        except APIConnectionError as exc:
            raise AIProviderError(
                "Unable to connect to OpenAI.",
            ) from exc

        except APIStatusError as exc:
            raise AIProviderError(
                f"OpenAI API returned {exc.status_code}.",
            ) from exc

        except Exception as exc:
            raise AIProviderError(
                "Unexpected OpenAI provider error.",
            ) from exc

    def _build_messages(
        self,
        messages: list[PromptMessage],
    ) -> list[ChatCompletionMessageParam]:
        """Convert prompt messages to OpenAI message parameters."""
        result: list[ChatCompletionMessageParam] = []

        for message in messages:
            match message.role:
                case PromptRole.SYSTEM:
                    result.append(
                        ChatCompletionSystemMessageParam(
                            role="system",
                            content=message.content,
                        ),
                    )

                case PromptRole.USER:
                    result.append(
                        ChatCompletionUserMessageParam(
                            role="user",
                            content=message.content,
                        ),
                    )

                case PromptRole.ASSISTANT:
                    result.append(
                        ChatCompletionAssistantMessageParam(
                            role="assistant",
                            content=message.content,
                        ),
                    )

                case PromptRole.DEVELOPER:
                    result.append(
                        ChatCompletionDeveloperMessageParam(
                            role="developer",
                            content=message.content,
                        ),
                    )

        return result

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Stream OpenAI response."""
        if False:
            yield ""

        raise NotImplementedError(
            "OpenAI streaming is not implemented yet.",
        )

"""Exceptions for the AI module."""

from __future__ import annotations


class AIError(Exception):
    """Base exception for AI operations."""


class AIProviderError(AIError):
    """Raised when an AI provider fails."""


class AIConfigurationError(AIError):
    """Raised when AI configuration is invalid."""


class AIModelNotSupportedError(AIError):
    """Raised when a model is unsupported."""


class PromptValidationError(AIError):
    """Raised when prompt validation fails."""


class AIRequestError(AIError):
    """Raised when an AI request fails."""


class AIResponseError(AIError):
    """Raised when an invalid response is received."""


class TokenLimitExceededError(AIError):
    """Raised when token limits are exceeded."""


class ProviderAuthenticationError(AIProviderError):
    """Raised when provider authentication fails."""


class RateLimitExceededError(AIProviderError):
    """Raised when provider rate limits are exceeded."""

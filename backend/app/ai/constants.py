"""Constants for the AI module."""

from __future__ import annotations

from enum import StrEnum

# API

AI_API_PREFIX = "/ai"
AI_TAG = "AI"

# Models

DEFAULT_MODEL = "gpt-4.1"
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 4096
DEFAULT_TIMEOUT_SECONDS = 60

# Provider Settings

DEFAULT_PROVIDER = "openai"

# Errors

AI_NOT_FOUND = "AI resource not found."
AI_PROVIDER_NOT_CONFIGURED = "AI provider is not configured."
AI_PROVIDER_UNAVAILABLE = "AI provider is unavailable."
AI_REQUEST_FAILED = "AI request failed."
INVALID_PROMPT = "Invalid prompt."
INVALID_PROVIDER = "Invalid AI provider."


class AIProvider(StrEnum):
    """Supported AI providers."""

    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    AZURE_OPENAI = "azure_openai"
    OLLAMA = "ollama"
    LMSTUDIO = "lmstudio"
    MOCK = "mock"
    GROQ = "groq"


class AIModel(StrEnum):
    """Supported AI models."""

    GPT_4_1 = "gpt-4.1"
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"

    CLAUDE_SONNET = "claude-sonnet-4"
    CLAUDE_OPUS = "claude-opus-4"

    GEMINI_PRO = "gemini-2.5-pro"
    GEMINI_FLASH = "gemini-2.5-flash"

    LLAMA3 = "llama3"
    MISTRAL = "mistral"


class AIRequestType(StrEnum):
    """AI request types."""

    CHAT = "chat"
    COMPLETION = "completion"
    EMBEDDING = "embedding"
    SUMMARIZATION = "summarization"
    CLASSIFICATION = "classification"
    TRANSLATION = "translation"
    SENTIMENT = "sentiment"
    EXTRACTION = "extraction"


class PromptRole(StrEnum):
    """Prompt roles."""

    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    DEVELOPER = "developer"
    TOOL = "tool"

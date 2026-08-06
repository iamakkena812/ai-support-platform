"""Schemas providers for AI."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.constants import AIModel, AIProvider, AIRequestType, PromptRole


class PromptMessage(BaseModel):
    """Single prompt message."""

    role: PromptRole
    content: str


class AIRequest(BaseModel):
    """AI request."""

    provider: AIProvider = AIProvider.OPENAI
    model: AIModel = AIModel.GPT_4_1
    request_type: AIRequestType = AIRequestType.CHAT

    messages: list[PromptMessage] = Field(default_factory=list)

    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=4096, ge=1)
    stream: bool = False


class TokenUsage(BaseModel):
    """Token usage."""

    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class AIResponse(BaseModel):
    """AI response."""

    provider: AIProvider
    model: AIModel

    content: str

    usage: TokenUsage

    finish_reason: str | None = None

    metadata: dict[str, Any] = Field(default_factory=dict)


class AIHealth(BaseModel):
    """AI health."""

    status: str

    providers: list[AIProvider]

    default_provider: AIProvider

    available_models: list[AIModel]

    checked_at: datetime


class AIConfiguration(BaseModel):
    """AI configuration."""

    default_provider: AIProvider

    default_model: AIModel

    temperature: float

    max_tokens: int

    timeout_seconds: int


class ConversationCreate(BaseModel):
    """Conversation creation."""

    title: str = Field(min_length=1, max_length=255)


class Conversation(BaseModel):
    """Conversation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    title: str

    created_at: datetime

    updated_at: datetime


class ChatCompletion(BaseModel):
    """Chat completion request."""

    conversation_id: UUID | None = None

    request: AIRequest

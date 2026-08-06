"""Schemas for AI chat."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.chat.constants import ConversationStatus, MessageStatus, MessageType


class ConversationCreate(BaseModel):
    """Schema for creating a conversation."""

    title: str = Field(
        min_length=1,
        max_length=255,
    )

    provider: str = Field(
        min_length=1,
        max_length=50,
    )

    model: str = Field(
        min_length=1,
        max_length=100,
    )

    customer_id: UUID | None = None

    ticket_id: UUID | None = None


class ConversationUpdate(BaseModel):
    """Schema for updating a conversation."""

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    status: ConversationStatus | None = None


class ConversationResponse(BaseModel):
    """Conversation response schema."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    organization_id: UUID

    customer_id: UUID | None

    ticket_id: UUID | None

    created_by: UUID

    title: str

    provider: str

    model: str

    status: ConversationStatus

    created_at: datetime

    updated_at: datetime


class ConversationListResponse(BaseModel):
    """Conversation list response."""

    items: list[ConversationResponse]

    total: int

    offset: int

    limit: int


class MessageCreate(BaseModel):
    """Schema for creating a conversation message."""

    role: MessageType

    content: str = Field(
        min_length=1,
    )


class MessageResponse(BaseModel):
    """Conversation message response."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    conversation_id: UUID

    role: MessageType

    content: str

    token_count: int

    latency_ms: int | None

    status: MessageStatus

    created_at: datetime


class ChatRequest(BaseModel):
    """Request for AI chat."""

    conversation_id: UUID

    message: str

    temperature: float = Field(
        default=0.7,
        ge=0,
        le=2,
    )

    max_tokens: int = Field(
        default=1024,
        gt=0,
    )

    stream: bool = False


class ChatResponse(BaseModel):
    """AI chat response."""

    conversation: ConversationResponse

    user_message: MessageResponse

    assistant_message: MessageResponse


class ChatStreamChunk(BaseModel):
    """Streaming response chunk."""

    delta: str

    finished: bool = False


class ConversationHistoryResponse(BaseModel):
    """Conversation history."""

    conversation: ConversationResponse

    messages: list[MessageResponse]

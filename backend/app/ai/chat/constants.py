"""Constants for AI chat."""

from __future__ import annotations

from enum import StrEnum


class ConversationStatus(StrEnum):
    """Conversation lifecycle status."""

    ACTIVE = "active"
    ARCHIVED = "archived"
    CLOSED = "closed"


class MessageType(StrEnum):
    """Supported chat message types."""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageStatus(StrEnum):
    """Message processing status."""

    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class ChatLimits:
    """AI chat limits."""

    MAX_TITLE_LENGTH = 255

    MAX_MESSAGE_LENGTH = 16_384

    MAX_HISTORY_MESSAGES = 100

    DEFAULT_HISTORY_MESSAGES = 20

    DEFAULT_MAX_TOKENS = 4_096

    DEFAULT_TEMPERATURE = 0.7

    MAX_TEMPERATURE = 2.0

    MIN_TEMPERATURE = 0.0

    MAX_CONTEXT_MESSAGES = 50

    DEFAULT_PAGE_SIZE = 20

    MAX_PAGE_SIZE = 100

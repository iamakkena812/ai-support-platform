"""Notification constants."""

from __future__ import annotations

from enum import StrEnum

TITLE_MIN_LENGTH = 3
TITLE_MAX_LENGTH = 255

MESSAGE_MIN_LENGTH = 1
MESSAGE_MAX_LENGTH = 5000


class NotificationType(StrEnum):
    """Supported notification types."""

    SYSTEM = "system"
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"


class NotificationPriority(StrEnum):
    """Supported notification priorities."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class NotificationChannel(StrEnum):
    """Supported notification delivery channels."""

    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"

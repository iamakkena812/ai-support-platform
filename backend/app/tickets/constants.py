"""Constants for the tickets module."""

from __future__ import annotations

from enum import StrEnum


class TicketStatus(StrEnum):
    """Supported ticket statuses."""

    OPEN = "open"
    IN_PROGRESS = "in_progress"
    PENDING = "pending"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(StrEnum):
    """Supported ticket priorities."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
DEFAULT_STATUS = TicketStatus.OPEN
DEFAULT_PRIORITY = TicketPriority.MEDIUM

TITLE_MIN_LENGTH = 5
TITLE_MAX_LENGTH = 255

DESCRIPTION_MIN_LENGTH = 10
DESCRIPTION_MAX_LENGTH = 10000

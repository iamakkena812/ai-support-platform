"""Constants for the SLA module."""

from __future__ import annotations

from enum import StrEnum

# API

SLA_TAG: str = "SLA"
SLA_PREFIX: str = "/sla"

# Pagination

DEFAULT_LIMIT: int = 50
MAX_LIMIT: int = 100

# Business Defaults

DEFAULT_FIRST_RESPONSE_MINUTES: int = 60
DEFAULT_RESOLUTION_MINUTES: int = 480

# Ticket Priorities


class SLAPriority(StrEnum):
    """Priority levels for SLA policies."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# SLA Status


class SLAStatus(StrEnum):
    """Lifecycle status for SLA events."""

    ACTIVE = "active"
    COMPLETED = "completed"
    BREACHED = "breached"


# Sort Fields

DEFAULT_POLICY_SORT: str = "name"
DEFAULT_EVENT_SORT: str = "started_at"

# Error Messages

POLICY_NOT_FOUND: str = "SLA policy not found."
EVENT_NOT_FOUND: str = "SLA event not found."
POLICY_ALREADY_EXISTS: str = "SLA policy already exists."
INVALID_PRIORITY: str = "Invalid SLA priority."
INACTIVE_POLICY: str = "SLA policy is inactive."

# Success Messages

POLICY_CREATED: str = "SLA policy created successfully."
POLICY_UPDATED: str = "SLA policy updated successfully."
POLICY_DELETED: str = "SLA policy deleted successfully."

"""Custom exceptions for the SLA module."""

from __future__ import annotations

from app.core.exceptions import (
    AuthenticationException,
    ResourceNotFoundException,
    ValidationException,
)
from app.sla.constants import (
    EVENT_NOT_FOUND,
    INACTIVE_POLICY,
    INVALID_PRIORITY,
    POLICY_ALREADY_EXISTS,
    POLICY_NOT_FOUND,
)


class SLAException(AuthenticationException):
    """Base exception for SLA-related errors."""


class SLAPolicyNotFoundException(ResourceNotFoundException):
    """Raised when an SLA policy cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(POLICY_NOT_FOUND)


class SLAEventNotFoundException(ResourceNotFoundException):
    """Raised when an SLA event cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(EVENT_NOT_FOUND)


class SLAPolicyAlreadyExistsException(ResourceNotFoundException):
    """Raised when attempting to create a duplicate SLA policy."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(POLICY_ALREADY_EXISTS)


class InvalidSLAPriorityException(ValidationException):
    """Raised when an invalid SLA priority is supplied."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INVALID_PRIORITY)


class InactiveSLAPolicyException(ValidationException):
    """Raised when an inactive SLA policy is used."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INACTIVE_POLICY)

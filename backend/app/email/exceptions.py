"""Email exceptions."""

from __future__ import annotations

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
)


class EmailNotFoundException(ResourceNotFoundException):
    """Raised when an email cannot be found."""

    def __init__(self) -> None:
        """Initialize exception."""
        super().__init__("Email")


class EmailAlreadySentException(ConflictException):
    """Raised when an email has already been sent."""

    def __init__(self) -> None:
        """Initialize exception."""
        super().__init__("Email has already been sent.")


class EmailAlreadyCancelledException(ConflictException):
    """Raised when an email has already been cancelled."""

    def __init__(self) -> None:
        """Initialize exception."""
        super().__init__("Email has already been cancelled.")


class EmailDeliveryException(ValidationException):
    """Raised when email delivery fails."""

    def __init__(
        self,
        message: str = "Email delivery failed.",
    ) -> None:
        """Initialize exception."""
        super().__init__(message)

"""Customer exceptions."""

from __future__ import annotations

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)


class CustomerNotFoundException(ResourceNotFoundException):
    """Raised when a customer cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Customer")


class CustomerAlreadyExistsException(ConflictException):
    """Raised when a customer already exists."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Customer already exists.")

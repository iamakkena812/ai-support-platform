"""Ticket exceptions."""

from __future__ import annotations


class TicketError(Exception):
    """Base exception for ticket errors."""


class TicketNotFoundError(TicketError):
    """Raised when a ticket is not found."""


class TicketConflictError(TicketError):
    """Raised when a ticket conflict occurs."""


class TicketPermissionError(TicketError):
    """Raised when ticket access is denied."""


class TicketValidationError(TicketError):
    """Raised when ticket validation fails."""

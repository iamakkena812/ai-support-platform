"""Exceptions for the workflow module."""

from __future__ import annotations

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
)

from .constants import (
    INVALID_ACTION,
    INVALID_CONDITION,
    INVALID_TRANSITION,
    INVALID_TRIGGER,
    WORKFLOW_ALREADY_EXISTS,
    WORKFLOW_DISABLED,
    WORKFLOW_NOT_FOUND,
)


class WorkflowException(Exception):
    """Base exception for the workflow module."""


class WorkflowNotFoundException(
    WorkflowException,
    ResourceNotFoundException,
):
    """Raised when a workflow cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(WORKFLOW_NOT_FOUND)


class WorkflowAlreadyExistsException(
    WorkflowException,
    ConflictException,
):
    """Raised when a workflow already exists."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(WORKFLOW_ALREADY_EXISTS)


class WorkflowDisabledException(
    WorkflowException,
    ValidationException,
):
    """Raised when attempting to execute a disabled workflow."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(WORKFLOW_DISABLED)


class InvalidWorkflowTransitionException(
    WorkflowException,
    ValidationException,
):
    """Raised when a ticket state transition is invalid."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INVALID_TRANSITION)


class InvalidWorkflowTriggerException(
    WorkflowException,
    ValidationException,
):
    """Raised when an unsupported trigger is used."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INVALID_TRIGGER)


class InvalidWorkflowActionException(
    WorkflowException,
    ValidationException,
):
    """Raised when an unsupported workflow action is executed."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INVALID_ACTION)


class InvalidWorkflowConditionException(
    WorkflowException,
    ValidationException,
):
    """Raised when an unsupported workflow condition is evaluated."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(INVALID_CONDITION)

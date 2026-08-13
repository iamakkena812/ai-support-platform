"""Exceptions for AI chat."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import AppException


class AIChatError(AppException):
    """Base exception for AI chat."""

    def __init__(
        self,
        message: str = "AI chat error.",
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the AI chat exception."""
        super().__init__(message=message, status_code=status_code)


class ConversationNotFoundError(AIChatError):
    """Raised when a conversation cannot be found."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(
            f"Conversation '{conversation_id}' was not found.",
            HTTPStatus.NOT_FOUND,
        )


class ConversationPermissionDeniedError(AIChatError):
    """Raised when a user tries to access another user's conversation."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(
            f"You do not have access to conversation '{conversation_id}'.",
            HTTPStatus.FORBIDDEN,
        )


class ConversationClosedError(AIChatError):
    """Raised when attempting to modify a closed conversation."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(
            f"Conversation '{conversation_id}' is closed.",
            HTTPStatus.CONFLICT,
        )


class ConversationArchivedError(AIChatError):
    """Raised when attempting to modify an archived conversation."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(
            f"Conversation '{conversation_id}' is archived.",
            HTTPStatus.CONFLICT,
        )


class MessageNotFoundError(AIChatError):
    """Raised when a message cannot be found."""

    def __init__(self, message_id: str) -> None:
        """Initialize the exception.

        Args:
            message_id: Message identifier.
        """
        super().__init__(
            f"Message '{message_id}' was not found.",
            HTTPStatus.NOT_FOUND,
        )


class ChatGenerationError(AIChatError):
    """Raised when AI response generation fails."""

    def __init__(self, message: str = "AI response generation failed.") -> None:
        """Initialize the exception.

        Args:
            message: Error description.
        """
        super().__init__(message, HTTPStatus.BAD_GATEWAY)

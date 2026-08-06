"""Exceptions for AI chat."""

from __future__ import annotations


class AIChatError(Exception):
    """Base exception for AI chat."""


class ConversationNotFoundError(AIChatError):
    """Raised when a conversation cannot be found."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(f"Conversation '{conversation_id}' was not found.")


class ConversationClosedError(AIChatError):
    """Raised when attempting to modify a closed conversation."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(f"Conversation '{conversation_id}' is closed.")


class ConversationArchivedError(AIChatError):
    """Raised when attempting to modify an archived conversation."""

    def __init__(self, conversation_id: str) -> None:
        """Initialize the exception.

        Args:
            conversation_id: Conversation identifier.
        """
        super().__init__(f"Conversation '{conversation_id}' is archived.")


class MessageNotFoundError(AIChatError):
    """Raised when a message cannot be found."""

    def __init__(self, message_id: str) -> None:
        """Initialize the exception.

        Args:
            message_id: Message identifier.
        """
        super().__init__(f"Message '{message_id}' was not found.")


class ChatGenerationError(AIChatError):
    """Raised when AI response generation fails."""

    def __init__(self, message: str) -> None:
        """Initialize the exception.

        Args:
            message: Error description.
        """
        super().__init__(message)


class StreamingError(AIChatError):
    """Raised when streaming fails."""

    def __init__(self, message: str) -> None:
        """Initialize the exception.

        Args:
            message: Error description.
        """
        super().__init__(message)


class PromptBuildError(AIChatError):
    """Raised when prompt construction fails."""

    def __init__(self, message: str) -> None:
        """Initialize the exception.

        Args:
            message: Error description.
        """
        super().__init__(message)

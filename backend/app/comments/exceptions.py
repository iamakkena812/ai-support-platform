"""Exceptions for the comments module."""

from __future__ import annotations

from http import HTTPStatus

from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
)

from app.core.exceptions import AppException


class CommentError(AppException):
    """Base exception for all comment-related errors."""

    def __init__(
        self,
        message: str,
        status_code: int = HTTPStatus.NOT_FOUND,
    ) -> None:
        super().__init__(
            message=message,
            status_code=HTTPStatus.NOT_FOUND,
        )


class CommentNotFoundError(CommentError):
    """Raised when a comment cannot be found."""

    def __init__(self) -> None:
        super().__init__(
            message="Comment not found.",
            status_code=HTTP_404_NOT_FOUND,
        )


class CommentAlreadyExistsError(CommentError):
    """Raised when attempting to create a duplicate comment."""

    def __init__(self) -> None:
        super().__init__(
            message="Comment already exists.",
            status_code=HTTP_409_CONFLICT,
        )


class CommentValidationError(CommentError):
    """Raised when comment validation fails."""

    def __init__(self, message: str = "Comment validation failed.") -> None:
        super().__init__(
            message=message,
            status_code=HTTP_400_BAD_REQUEST,
        )


class CommentPermissionDeniedError(CommentError):
    """Raised when the user is not permitted to perform an action."""

    def __init__(self) -> None:
        super().__init__(
            message="Permission denied.",
            status_code=HTTP_403_FORBIDDEN,
        )


class CommentDeletedError(CommentError):
    """Raised when an operation targets a deleted comment."""

    def __init__(self) -> None:
        super().__init__(
            message="Comment has been deleted.",
            status_code=HTTP_400_BAD_REQUEST,
        )


class InvalidCommentVisibilityError(CommentValidationError):
    """Raised when an invalid comment visibility value is provided."""

    def __init__(self) -> None:
        super().__init__("Invalid comment visibility.")

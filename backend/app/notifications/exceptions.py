"""Exceptions for the notifications module."""

from __future__ import annotations

from http import HTTPStatus

from starlette.status import (
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)

from app.core.exceptions import AppException


class NotificationError(AppException):
    """Base exception for all notification-related errors."""

    def __init__(
        self,
        message: str,
        status_code: int = HTTPStatus.NOT_FOUND,
    ) -> None:
        super().__init__(
            message=message,
            status_code=HTTPStatus(status_code),
        )


class NotificationNotFoundError(NotificationError):
    """Raised when a notification cannot be found."""

    def __init__(self) -> None:
        super().__init__(
            message="Notification not found.",
            status_code=HTTP_404_NOT_FOUND,
        )


class NotificationRecipientNotFoundError(NotificationError):
    """Raised when the recipient does not exist in the caller's organization."""

    def __init__(self) -> None:
        super().__init__(
            message="Recipient not found.",
            status_code=HTTP_404_NOT_FOUND,
        )


class NotificationPermissionDeniedError(NotificationError):
    """Raised when the user is not permitted to access a notification."""

    def __init__(self) -> None:
        super().__init__(
            message="Permission denied.",
            status_code=HTTP_403_FORBIDDEN,
        )

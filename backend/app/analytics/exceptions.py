"""Exceptions for the analytics module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import AppException


class AnalyticsError(AppException):
    """Base exception for analytics."""

    def __init__(
        self,
        message: str = "Analytics error.",
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the analytics exception."""
        super().__init__(message=message, status_code=status_code)


class InvalidDateRangeError(AnalyticsError):
    """Raised when an invalid date range is supplied."""

    def __init__(
        self,
        message: str = "start_date must not be after end_date.",
    ) -> None:
        """Initialize the invalid date range exception."""
        super().__init__(message=message, status_code=HTTPStatus.BAD_REQUEST)

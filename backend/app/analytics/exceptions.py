"""Exceptions for the analytics module."""

from __future__ import annotations


class AnalyticsError(Exception):
    """Base exception for analytics."""


class AnalyticsNotFoundError(AnalyticsError):
    """Raised when analytics data cannot be found."""


class DashboardGenerationError(AnalyticsError):
    """Raised when dashboard generation fails."""


class MetricsCalculationError(AnalyticsError):
    """Raised when metric calculation fails."""


class ReportGenerationError(AnalyticsError):
    """Raised when report generation fails."""


class InvalidDateRangeError(AnalyticsError):
    """Raised when an invalid date range is supplied."""


class UnsupportedReportError(AnalyticsError):
    """Raised when an unsupported report is requested."""

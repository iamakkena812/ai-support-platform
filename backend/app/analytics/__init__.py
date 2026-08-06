"""Tests for the analytics module."""

from __future__ import annotations

from app.analytics.repository import AnalyticsRepository
from app.analytics.router import router
from app.analytics.service import AnalyticsService

__all__ = [
    "AnalyticsRepository",
    "AnalyticsService",
    "router",
]

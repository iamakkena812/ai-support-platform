"""Dependency providers for analytics."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.analytics.repository import AnalyticsRepository
from app.analytics.service import AnalyticsService
from app.database import get_db


def get_analytics_repository(
    session: Annotated[Session, Depends(get_db)],
) -> AnalyticsRepository:
    """Return an analytics repository.

    Args:
        session: Database session.

    Returns:
        Analytics repository instance.
    """
    return AnalyticsRepository(session)


def get_analytics_service(
    repository: Annotated[
        AnalyticsRepository,
        Depends(get_analytics_repository),
    ],
) -> AnalyticsService:
    """Return an analytics service.

    Args:
        repository: Analytics repository.

    Returns:
        Analytics service instance.
    """
    return AnalyticsService(repository)

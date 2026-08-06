"""Dependencies for the notifications module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.notifications.repository import NotificationRepository
from app.notifications.service import NotificationService

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_notification_service(
    session: DatabaseSession,
) -> NotificationService:
    """Return notification service."""
    repository = NotificationRepository(session)
    return NotificationService(repository)

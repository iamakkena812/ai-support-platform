"""Dependencies for the notifications module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends

from app.core.dependencies import DatabaseDependency
from app.notifications.repository import NotificationRepository
from app.notifications.service import NotificationService
from app.repositories.user import UserRepository


def get_notification_repository(
    db: DatabaseDependency,
) -> NotificationRepository:
    """Return a notification repository."""
    return NotificationRepository(db)


NotificationRepositoryDependency = Annotated[
    NotificationRepository,
    Depends(get_notification_repository),
]


def get_notification_user_repository(
    db: DatabaseDependency,
) -> UserRepository:
    """Return a user repository for recipient validation."""
    return UserRepository(db)


NotificationUserRepositoryDependency = Annotated[
    UserRepository,
    Depends(get_notification_user_repository),
]


def get_notification_service(
    repository: NotificationRepositoryDependency,
    user_repository: NotificationUserRepositoryDependency,
) -> NotificationService:
    """Return a notification service."""
    return NotificationService(repository, user_repository)


NotificationServiceDependency = Annotated[
    NotificationService,
    Depends(get_notification_service),
]

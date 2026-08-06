"""Notification repository."""

from __future__ import annotations

import builtins
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.notifications.models import Notification


class NotificationRepository:
    """Repository for notification persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        notification: Notification,
    ) -> Notification:
        """Create a notification."""
        self._session.add(notification)
        self._session.commit()
        self._session.refresh(notification)

        return notification

    def get(
        self,
        notification_id: UUID,
    ) -> Notification | None:
        """Return a notification by ID."""
        statement = select(Notification).where(
            Notification.id == notification_id,
            Notification.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Notification]:
        """Return a paginated list of notifications."""
        statement = (
            select(Notification)
            .where(Notification.is_deleted.is_(False))
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement).all())

    def list_by_recipient(
        self,
        recipient_id: UUID,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> builtins.list[Notification]:
        """Return notifications for a recipient."""
        statement = (
            select(Notification)
            .where(
                Notification.recipient_id == recipient_id,
                Notification.is_deleted.is_(False),
            )
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement).all())

    def list_unread(
        self,
        recipient_id: UUID,
    ) -> builtins.list[Notification]:
        """Return unread notifications for a recipient."""
        statement = select(Notification).where(
            Notification.recipient_id == recipient_id,
            Notification.is_read.is_(False),
            Notification.is_deleted.is_(False),
        )

        return list(self._session.scalars(statement).all())

    def update(
        self,
        notification: Notification,
    ) -> Notification:
        """Update a notification."""
        self._session.add(notification)
        self._session.commit()
        self._session.refresh(notification)

        return notification

    def delete(
        self,
        notification: Notification,
    ) -> None:
        """Soft delete a notification."""
        notification.soft_delete()

        self._session.add(notification)
        self._session.commit()
        self._session.refresh(notification)

"""Notification repository."""

from __future__ import annotations

import builtins
from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import Select

from app.notifications.constants import NotificationType
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
        organization_id: UUID,
    ) -> Notification | None:
        """Return a notification by ID, scoped to the organization."""
        statement = select(Notification).where(
            Notification.id == notification_id,
            Notification.organization_id == organization_id,
            Notification.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    @staticmethod
    def _apply_filters(
        statement: Select[Any],
        *,
        notification_type: NotificationType | None,
        is_read: bool | None,
        search: str | None,
    ) -> Select[Any]:
        """Apply shared list/count filters to a select statement."""
        if notification_type is not None:
            statement = statement.where(
                Notification.notification_type == notification_type,
            )

        if is_read is not None:
            statement = statement.where(Notification.is_read.is_(is_read))

        if search:
            pattern = f"%{search}%"
            statement = statement.where(
                Notification.title.ilike(pattern)
                | Notification.message.ilike(pattern),
            )

        return statement

    def list(
        self,
        *,
        organization_id: UUID,
        recipient_id: UUID,
        notification_type: NotificationType | None = None,
        is_read: bool | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Notification]:
        """Return a paginated, filtered list of a recipient's notifications."""
        statement = select(Notification).where(
            Notification.organization_id == organization_id,
            Notification.recipient_id == recipient_id,
            Notification.is_deleted.is_(False),
        )

        statement = self._apply_filters(
            statement,
            notification_type=notification_type,
            is_read=is_read,
            search=search,
        )

        statement = (
            statement.order_by(Notification.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement).all())

    def count(
        self,
        *,
        organization_id: UUID,
        recipient_id: UUID,
        notification_type: NotificationType | None = None,
        is_read: bool | None = None,
        search: str | None = None,
    ) -> int:
        """Return the total number of notifications matching the filters."""
        statement = (
            select(func.count())
            .select_from(Notification)
            .where(
                Notification.organization_id == organization_id,
                Notification.recipient_id == recipient_id,
                Notification.is_deleted.is_(False),
            )
        )

        statement = self._apply_filters(
            statement,
            notification_type=notification_type,
            is_read=is_read,
            search=search,
        )

        return int(self._session.scalar(statement) or 0)

    def list_unread(
        self,
        recipient_id: UUID,
        organization_id: UUID,
    ) -> builtins.list[Notification]:
        """Return unread notifications for a recipient."""
        statement = select(Notification).where(
            Notification.recipient_id == recipient_id,
            Notification.organization_id == organization_id,
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

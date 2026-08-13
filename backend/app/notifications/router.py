"""Notification router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.notifications.constants import NotificationType
from app.notifications.dependencies import NotificationServiceDependency
from app.notifications.schemas import (
    CreateNotificationRequest,
    NotificationListResponse,
    NotificationRead,
    NotificationStatus,
    UpdateNotificationRequest,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get(
    "",
    response_model=NotificationListResponse,
    status_code=status.HTTP_200_OK,
    summary="List notifications",
)
async def list_notifications(
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
    notification_type: Annotated[
        NotificationType | None,
        Query(alias="type"),
    ] = None,
    status_filter: Annotated[
        NotificationStatus | None,
        Query(alias="status"),
    ] = None,
    search: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100, alias="pageSize")] = 10,
) -> NotificationListResponse:
    """Return the current user's own notifications."""
    offset = (page - 1) * page_size

    notifications = service.list_notifications(
        organization_id=current_user.organization_id,
        recipient_id=current_user.id,
        notification_type=notification_type,
        status=status_filter,
        search=search,
        offset=offset,
        limit=page_size,
    )
    total = service.count_notifications(
        organization_id=current_user.organization_id,
        recipient_id=current_user.id,
        notification_type=notification_type,
        status=status_filter,
        search=search,
    )

    return NotificationListResponse(
        items=[NotificationRead.from_notification(n) for n in notifications],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


@router.post(
    "",
    response_model=NotificationRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create notification",
)
async def create_notification(
    request: CreateNotificationRequest,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> NotificationRead:
    """Create a notification for a recipient in the caller's organization."""
    notification = service.create_notification(
        organization_id=current_user.organization_id,
        request=request,
    )

    return NotificationRead.from_notification(notification)


@router.get(
    "/unread",
    response_model=list[NotificationRead],
    status_code=status.HTTP_200_OK,
    summary="List unread notifications",
)
async def list_unread_notifications(
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> list[NotificationRead]:
    """Return unread notifications for the current user."""
    notifications = service.list_unread_notifications(
        current_user.id,
        current_user.organization_id,
    )

    return [NotificationRead.from_notification(n) for n in notifications]


@router.get(
    "/{notification_id}",
    response_model=NotificationRead,
    status_code=status.HTTP_200_OK,
    summary="Get notification",
)
async def get_notification(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> NotificationRead:
    """Return a notification. Only the recipient may view it."""
    notification = service.get_notification(
        notification_id,
        current_user.organization_id,
        current_user.id,
    )

    return NotificationRead.from_notification(notification)


@router.put(
    "/{notification_id}",
    response_model=NotificationRead,
    status_code=status.HTTP_200_OK,
    summary="Update notification",
)
async def update_notification(
    notification_id: UUID,
    request: UpdateNotificationRequest,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> NotificationRead:
    """Update a notification. Only the recipient may update it."""
    notification = service.update_notification(
        notification_id,
        current_user.organization_id,
        current_user.id,
        request,
    )

    return NotificationRead.from_notification(notification)


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationRead,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
)
async def mark_notification_read(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> NotificationRead:
    """Mark a notification as read. Only the recipient may mark it."""
    notification = service.mark_as_read(
        notification_id,
        current_user.organization_id,
        current_user.id,
    )

    return NotificationRead.from_notification(notification)


@router.patch(
    "/{notification_id}/unread",
    response_model=NotificationRead,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as unread",
)
async def mark_notification_unread(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> NotificationRead:
    """Mark a notification as unread. Only the recipient may mark it."""
    notification = service.mark_as_unread(
        notification_id,
        current_user.organization_id,
        current_user.id,
    )

    return NotificationRead.from_notification(notification)


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete notification",
)
async def delete_notification(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> None:
    """Delete a notification. Only the recipient may delete it."""
    service.delete_notification(
        notification_id,
        current_user.organization_id,
        current_user.id,
    )

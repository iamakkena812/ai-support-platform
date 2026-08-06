"""Notification router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import DatabaseDependency
from app.models import User
from app.notifications.repository import NotificationRepository
from app.notifications.schemas import (
    CreateNotificationRequest,
    NotificationResponse,
    UpdateNotificationRequest,
)
from app.notifications.service import NotificationService
from app.rbac.dependencies import require_permission

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


def get_notification_service(
    db: DatabaseDependency,
) -> NotificationService:
    """Return a notification service."""
    repository = NotificationRepository(db)

    return NotificationService(repository)


NotificationServiceDependency = Annotated[
    NotificationService,
    Depends(get_notification_service),
]

NotificationReadPermission = Depends(
    require_permission(
        "notification",
        "read",
    ),
)

NotificationCreatePermission = Depends(
    require_permission(
        "notification",
        "create",
    ),
)

NotificationUpdatePermission = Depends(
    require_permission(
        "notification",
        "update",
    ),
)


@router.get(
    "",
    response_model=list[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="List notifications",
)
async def list_notifications(
    service: NotificationServiceDependency,
    current_user: User = NotificationReadPermission,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[NotificationResponse]:
    """Return notifications for the current user."""
    notifications = service.list_recipient_notifications(
        current_user.id,
        offset=offset,
        limit=limit,
    )

    return [
        NotificationResponse.model_validate(notification)
        for notification in notifications
    ]


@router.post(
    "",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create notification",
)
async def create_notification(
    request: CreateNotificationRequest,
    service: NotificationServiceDependency,
    current_user: User = NotificationCreatePermission,
) -> NotificationResponse:
    """Create a notification."""
    notification = service.create_notification(
        organization_id=current_user.organization_id,
        request=request,
    )

    return NotificationResponse.model_validate(notification)


@router.put(
    "/{notification_id}",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Update notification",
)
async def update_notification(
    notification_id: UUID,
    request: UpdateNotificationRequest,
    service: NotificationServiceDependency,
    current_user: User = NotificationUpdatePermission,
) -> NotificationResponse:
    """Update a notification."""
    notification = service.update_notification(
        notification_id,
        request,
    )

    return NotificationResponse.model_validate(notification)


@router.get(
    "/unread",
    response_model=list[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="List unread notifications",
)
async def list_unread_notifications(
    service: NotificationServiceDependency,
    current_user: User = NotificationReadPermission,
) -> list[NotificationResponse]:
    """Return unread notifications for the current user."""
    notifications = service.list_unread_notifications(
        current_user.id,
    )

    return [
        NotificationResponse.model_validate(notification)
        for notification in notifications
    ]


@router.get(
    "/{notification_id}",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get notification",
)
async def get_notification(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: User = NotificationReadPermission,
) -> NotificationResponse:
    """Return a notification by its identifier."""
    notification = service.get_notification(
        notification_id,
    )

    return NotificationResponse.model_validate(
        notification,
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
)
async def mark_notification_read(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: User = NotificationUpdatePermission,
) -> NotificationResponse:
    """Mark a notification as read."""
    notification = service.mark_as_read(
        notification_id,
    )

    return NotificationResponse.model_validate(
        notification,
    )


@router.patch(
    "/{notification_id}/unread",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as unread",
)
async def mark_notification_unread(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: User = NotificationUpdatePermission,
) -> NotificationResponse:
    """Mark a notification as unread."""
    notification = service.mark_as_unread(
        notification_id,
    )

    return NotificationResponse.model_validate(
        notification,
    )


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete notification",
)
async def delete_notification(
    notification_id: UUID,
    service: NotificationServiceDependency,
    current_user: User = Depends(
        require_permission(
            "notification",
            "delete",
        ),
    ),
) -> None:
    """Soft delete a notification."""
    service.delete_notification(
        notification_id,
    )

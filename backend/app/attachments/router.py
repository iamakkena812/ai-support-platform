"""API routes for the attachments module."""

from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from fastapi import APIRouter, status

from app.attachments.dependencies import AttachmentServiceDependency
from app.attachments.models import Attachment
from app.attachments.schemas import (
    AttachmentCreate,
    AttachmentList,
    AttachmentRead,
    AttachmentUpdate,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"],
)


def _to_attachment(
    attachment: Attachment,
) -> AttachmentRead:
    """Convert an attachment model to a response schema."""
    return AttachmentRead.model_validate(attachment)


def _to_attachment_list(
    attachments: Sequence[Attachment],
) -> AttachmentList:
    """Convert attachment models to a list response."""
    return AttachmentList(
        items=[_to_attachment(attachment) for attachment in attachments],
        total=len(attachments),
    )


@router.post(
    "/tickets/{ticket_id}",
    response_model=AttachmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket_attachment(
    ticket_id: UUID,
    request: AttachmentCreate,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Create an attachment for a ticket."""
    attachment = service.create_attachment(
        organization_id=current_user.organization_id,
        uploaded_by_id=current_user.id,
        request=request,
    )

    return _to_attachment(attachment)


@router.post(
    "/comments/{comment_id}",
    response_model=AttachmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_comment_attachment(
    comment_id: UUID,
    request: AttachmentCreate,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Create an attachment for a comment."""
    attachment = service.create_attachment(
        organization_id=current_user.organization_id,
        uploaded_by_id=current_user.id,
        request=request.model_copy(
            update={
                "comment_id": comment_id,
            },
        ),
    )

    return _to_attachment(attachment)


@router.get(
    "",
    response_model=AttachmentList,
)
def list_attachments(
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> AttachmentList:
    """Return all active attachments."""
    return _to_attachment_list(
        service.list_attachments(),
    )


@router.get(
    "/{attachment_id}",
    response_model=AttachmentRead,
)
def get_attachment(
    attachment_id: UUID,
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Return an attachment by identifier."""
    return _to_attachment(
        service.get_attachment(
            attachment_id,
        ),
    )


@router.get(
    "/tickets/{ticket_id}",
    response_model=AttachmentList,
)
def list_ticket_attachments(
    ticket_id: UUID,
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> AttachmentList:
    """Return attachments for a ticket."""
    return _to_attachment_list(
        service.list_ticket_attachments(
            ticket_id,
        ),
    )


@router.get(
    "/comments/{comment_id}",
    response_model=AttachmentList,
)
def list_comment_attachments(
    comment_id: UUID,
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> AttachmentList:
    """Return attachments for a comment."""
    return _to_attachment_list(
        service.list_comment_attachments(
            comment_id,
        ),
    )


@router.put(
    "/{attachment_id}",
    response_model=AttachmentRead,
)
def update_attachment(
    attachment_id: UUID,
    request: AttachmentUpdate,
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Update an attachment."""
    attachment = service.update_attachment(
        attachment_id,
        request,
    )

    return _to_attachment(attachment)


@router.delete(
    "/{attachment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_attachment(
    attachment_id: UUID,
    service: AttachmentServiceDependency,
    _: CurrentActiveUserDependency,
) -> None:
    """Delete an attachment."""
    service.delete_attachment(
        attachment_id,
    )

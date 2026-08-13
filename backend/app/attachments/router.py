"""API routes for the attachments module."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, File, Form, Query, Response, UploadFile, status

from app.attachments.dependencies import AttachmentServiceDependency
from app.attachments.schemas import (
    AttachmentListResponse,
    AttachmentRead,
    AttachmentUpdate,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"],
)


@router.post(
    "/tickets/{ticket_id}",
    response_model=AttachmentRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_ticket_attachment(
    ticket_id: UUID,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
    file: UploadFile = File(...),
    description: str | None = Form(default=None),
) -> AttachmentRead:
    """Upload an attachment for a ticket."""
    content = await file.read()

    attachment = service.create_ticket_attachment(
        organization_id=current_user.organization_id,
        uploaded_by_id=current_user.id,
        ticket_id=ticket_id,
        original_filename=file.filename or "file",
        content_type=file.content_type,
        content=content,
        description=description,
    )

    return AttachmentRead.from_attachment(attachment)


@router.post(
    "/comments/{comment_id}",
    response_model=AttachmentRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment_attachment(
    comment_id: UUID,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
    file: UploadFile = File(...),
    description: str | None = Form(default=None),
) -> AttachmentRead:
    """Upload an attachment for a comment."""
    content = await file.read()

    attachment = service.create_comment_attachment(
        organization_id=current_user.organization_id,
        uploaded_by_id=current_user.id,
        comment_id=comment_id,
        original_filename=file.filename or "file",
        content_type=file.content_type,
        content=content,
        description=description,
    )

    return AttachmentRead.from_attachment(attachment)


@router.get(
    "",
    response_model=AttachmentListResponse,
)
def list_attachments(
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
    ticket_id: UUID | None = Query(default=None, alias="ticketId"),
    comment_id: UUID | None = Query(default=None, alias="commentId"),
    content_type: str | None = Query(default=None, alias="contentType"),
    uploaded_by: UUID | None = Query(default=None, alias="uploadedBy"),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
) -> AttachmentListResponse:
    """Return a paginated list of attachments, scoped to the caller's organization."""
    offset = (page - 1) * page_size

    attachments = service.list_attachments(
        organization_id=current_user.organization_id,
        ticket_id=ticket_id,
        comment_id=comment_id,
        content_type=content_type,
        uploaded_by=uploaded_by,
        search=search,
        offset=offset,
        limit=page_size,
    )
    total = service.count_attachments(
        organization_id=current_user.organization_id,
        ticket_id=ticket_id,
        comment_id=comment_id,
        content_type=content_type,
        uploaded_by=uploaded_by,
        search=search,
    )

    return AttachmentListResponse(
        items=[
            AttachmentRead.from_attachment(attachment)
            for attachment in attachments
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


@router.get(
    "/{attachment_id}",
    response_model=AttachmentRead,
)
def get_attachment(
    attachment_id: UUID,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Return an attachment by identifier, scoped to the caller's organization."""
    attachment = service.get_attachment(
        attachment_id,
        current_user.organization_id,
    )

    return AttachmentRead.from_attachment(attachment)


@router.get(
    "/{attachment_id}/download",
)
def download_attachment(
    attachment_id: UUID,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> Response:
    """Download an attachment's stored file."""
    attachment, content = service.download_attachment(
        attachment_id,
        current_user.organization_id,
    )

    return Response(
        content=content,
        media_type=attachment.content_type,
        headers={
            "Content-Disposition": (
                f'attachment; filename="{attachment.original_filename}"'
            ),
        },
    )


@router.put(
    "/{attachment_id}",
    response_model=AttachmentRead,
)
def update_attachment(
    attachment_id: UUID,
    request: AttachmentUpdate,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> AttachmentRead:
    """Update an attachment. Only the uploader may update it."""
    attachment = service.update_attachment(
        attachment_id,
        current_user.organization_id,
        current_user.id,
        request,
    )

    return AttachmentRead.from_attachment(attachment)


@router.delete(
    "/{attachment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_attachment(
    attachment_id: UUID,
    service: AttachmentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> None:
    """Delete an attachment. Only the uploader may delete it."""
    service.delete_attachment(
        attachment_id,
        current_user.organization_id,
        current_user.id,
    )

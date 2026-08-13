"""Comment router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.comments.dependencies import CommentServiceDependency
from app.comments.schemas import (
    CommentListResponse,
    CommentResponse,
    CreateCommentRequest,
    UpdateCommentRequest,
)

router = APIRouter(
    prefix="/comments",
    tags=["Comments"],
)


@router.post(
    "/tickets/{ticket_id}",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    ticket_id: UUID,
    request: CreateCommentRequest,
    service: CommentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> CommentResponse:
    """Create a comment."""
    comment = service.create_comment(
        organization_id=current_user.organization_id,
        author_id=current_user.id,
        ticket_id=ticket_id,
        request=request,
    )

    return CommentResponse.from_comment(comment)


@router.get(
    "",
    response_model=CommentListResponse,
)
def list_comments(
    service: CommentServiceDependency,
    current_user: CurrentActiveUserDependency,
    ticket_id: UUID | None = Query(default=None, alias="ticketId"),
    author_id: UUID | None = Query(default=None, alias="authorId"),
    is_internal: bool | None = Query(default=None, alias="isInternal"),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
) -> CommentListResponse:
    """Return a paginated list of comments, scoped to the caller's organization."""
    offset = (page - 1) * page_size

    comments = service.list_comments(
        organization_id=current_user.organization_id,
        ticket_id=ticket_id,
        author_id=author_id,
        is_internal=is_internal,
        search=search,
        offset=offset,
        limit=page_size,
    )
    total = service.count_comments(
        organization_id=current_user.organization_id,
        ticket_id=ticket_id,
        author_id=author_id,
        is_internal=is_internal,
        search=search,
    )

    return CommentListResponse(
        items=[CommentResponse.from_comment(comment) for comment in comments],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


@router.get(
    "/{comment_id}",
    response_model=CommentResponse,
)
def get_comment(
    comment_id: UUID,
    service: CommentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> CommentResponse:
    """Return a comment, scoped to the caller's organization."""
    comment = service.get_comment(comment_id, current_user.organization_id)

    return CommentResponse.from_comment(comment)


@router.put(
    "/{comment_id}",
    response_model=CommentResponse,
)
def update_comment(
    comment_id: UUID,
    request: UpdateCommentRequest,
    service: CommentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> CommentResponse:
    """Update a comment. Only the original author may update it."""
    comment = service.update_comment(
        comment_id,
        current_user.organization_id,
        current_user.id,
        request,
    )

    return CommentResponse.from_comment(comment)


@router.delete(
    "/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_comment(
    comment_id: UUID,
    service: CommentServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> None:
    """Delete a comment. Only the original author may delete it."""
    service.delete_comment(
        comment_id,
        current_user.organization_id,
        current_user.id,
    )

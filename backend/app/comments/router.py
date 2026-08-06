"""Comment router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.comments.dependencies import CommentServiceDependency
from app.comments.schemas import (
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

    return CommentResponse.model_validate(comment)


@router.get(
    "",
    response_model=list[CommentResponse],
)
def list_comments(
    service: CommentServiceDependency,
    _: CurrentActiveUserDependency,
    ticket_id: UUID | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[CommentResponse]:
    """Return comments."""
    comments = service.list_comments(
        ticket_id=ticket_id,
        offset=offset,
        limit=limit,
    )

    return [CommentResponse.model_validate(comment) for comment in comments]


@router.get(
    "/{comment_id}",
    response_model=CommentResponse,
)
def get_comment(
    comment_id: UUID,
    service: CommentServiceDependency,
    _: CurrentActiveUserDependency,
) -> CommentResponse:
    """Return a comment."""
    comment = service.get_comment(comment_id)

    return CommentResponse.model_validate(comment)


@router.put(
    "/{comment_id}",
    response_model=CommentResponse,
)
def update_comment(
    comment_id: UUID,
    request: UpdateCommentRequest,
    service: CommentServiceDependency,
    _: CurrentActiveUserDependency,
) -> CommentResponse:
    """Update a comment."""
    comment = service.update_comment(
        comment_id,
        request,
    )

    return CommentResponse.model_validate(comment)


@router.delete(
    "/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_comment(
    comment_id: UUID,
    service: CommentServiceDependency,
    _: CurrentActiveUserDependency,
) -> None:
    """Delete a comment."""
    service.delete_comment(comment_id)

"""Comment service tests."""

from __future__ import annotations

from uuid import uuid4

from pytest import raises
from sqlalchemy.orm import Session

from app.comments.constants import CommentVisibility
from app.comments.exceptions import CommentNotFoundError
from app.comments.repository import CommentRepository
from app.comments.schemas import (
    CreateCommentRequest,
    UpdateCommentRequest,
)
from app.comments.service import CommentService
from app.models.organization import Organization


def build_request(
    *,
    content: str = "First comment",
) -> CreateCommentRequest:
    """Build a comment request."""
    return CreateCommentRequest(
        content=content,
        visibility=CommentVisibility.INTERNAL,
    )


def test_create_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Create a comment."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    author_id = uuid4()
    ticket_id = uuid4()

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=author_id,
        ticket_id=ticket_id,
        request=build_request(),
    )

    assert comment.id is not None
    assert comment.content == "First comment"
    assert comment.author_id == author_id
    assert comment.ticket_id == ticket_id


def test_get_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return a comment."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    author_id = uuid4()
    ticket_id = uuid4()

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=author_id,
        ticket_id=ticket_id,
        request=build_request(),
    )

    result = service.get_comment(comment.id)

    assert result.id == comment.id


def test_get_missing_comment(
    db_session: Session,
) -> None:
    """Raise comment not found."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    with raises(CommentNotFoundError):
        service.get_comment(uuid4())


def test_list_comments(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return comment list."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    service.create_comment(
        organization_id=organization.id,
        author_id=uuid4(),
        ticket_id=uuid4(),
        request=build_request(),
    )

    comments = service.list_comments()

    assert len(comments) >= 1


def test_update_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Update a comment."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=uuid4(),
        ticket_id=uuid4(),
        request=build_request(),
    )

    updated = service.update_comment(
        comment.id,
        UpdateCommentRequest(
            content="Updated comment",
            visibility=CommentVisibility.PUBLIC,
        ),
    )

    assert updated.content == "Updated comment"
    assert updated.visibility == CommentVisibility.PUBLIC
    assert updated.is_edited is True


def test_delete_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Delete a comment."""
    repository = CommentRepository(db_session)
    service = CommentService(repository)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=uuid4(),
        ticket_id=uuid4(),
        request=build_request(),
    )

    service.delete_comment(comment.id)

    deleted = repository.get(comment.id)

    assert deleted is None

"""Comment repository tests."""

from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.comments.constants import CommentVisibility
from app.comments.models import Comment
from app.comments.repository import CommentRepository
from app.models.organization import Organization


def build_comment(
    organization: Organization,
    *,
    ticket_id: UUID | None = None,
    author_id: UUID | None = None,
    content: str = "First comment",
) -> Comment:
    """Build a comment instance."""
    return Comment(
        organization_id=organization.id,
        ticket_id=ticket_id or uuid4(),
        author_id=author_id or uuid4(),
        content=content,
        visibility=CommentVisibility.INTERNAL,
        is_internal=True,
        is_edited=False,
        is_deleted=False,
    )


def test_create_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Create a comment."""
    repository = CommentRepository(db_session)

    comment = build_comment(organization)

    result = repository.create(comment)

    assert result.id is not None
    assert result.content == "First comment"


def test_get_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Get a comment."""
    repository = CommentRepository(db_session)

    comment = repository.create(build_comment(organization))

    result = repository.get(comment.id)

    assert result is not None
    assert result.id == comment.id


def test_get_missing_comment(
    db_session: Session,
) -> None:
    """Return None for missing comment."""
    repository = CommentRepository(db_session)

    result = repository.get(uuid4())

    assert result is None


def test_list_comments(
    db_session: Session,
    organization: Organization,
) -> None:
    """List comments."""
    repository = CommentRepository(db_session)

    repository.create(build_comment(organization))

    comments = repository.list()

    assert len(comments) >= 1


def test_update_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Update a comment."""
    repository = CommentRepository(db_session)

    comment = repository.create(build_comment(organization))

    comment.content = "Updated comment"

    updated = repository.update(comment)

    assert updated.content == "Updated comment"


def test_delete_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Soft delete a comment."""
    repository = CommentRepository(db_session)

    comment = repository.create(build_comment(organization))

    repository.delete(comment)

    assert comment.is_deleted is True


def test_comment_pagination(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return paginated comments."""
    repository = CommentRepository(db_session)

    for index in range(5):
        repository.create(
            build_comment(
                organization,
                content=f"Comment {index}",
            )
        )

    comments = repository.list(
        offset=0,
        limit=3,
    )

    assert len(comments) == 3

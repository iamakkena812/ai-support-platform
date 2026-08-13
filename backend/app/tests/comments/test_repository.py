"""Comment repository tests."""

from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.comments.constants import CommentVisibility
from app.comments.models import Comment
from app.comments.repository import CommentRepository
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def build_comment(
    organization: Organization,
    *,
    ticket_id: UUID | None = None,
    author_id: UUID | None = None,
    content: str = "First comment",
    is_internal: bool = True,
) -> Comment:
    """Build a comment instance."""
    return Comment(
        organization_id=organization.id,
        ticket_id=ticket_id or uuid4(),
        author_id=author_id or uuid4(),
        content=content,
        visibility=(
            CommentVisibility.INTERNAL if is_internal else CommentVisibility.PUBLIC
        ),
        is_internal=is_internal,
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
    """Get a comment scoped to its organization."""
    repository = CommentRepository(db_session)

    comment = repository.create(build_comment(organization))

    result = repository.get(comment.id, organization.id)

    assert result is not None
    assert result.id == comment.id


def test_get_comment_wrong_organization_returns_none(
    db_session: Session,
    organization: Organization,
) -> None:
    """A comment is invisible outside its own organization."""
    repository = CommentRepository(db_session)

    comment = repository.create(build_comment(organization))

    result = repository.get(comment.id, uuid4())

    assert result is None


def test_get_missing_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return None for missing comment."""
    repository = CommentRepository(db_session)

    result = repository.get(uuid4(), organization.id)

    assert result is None


def test_list_comments(
    db_session: Session,
    organization: Organization,
) -> None:
    """List comments scoped to an organization."""
    repository = CommentRepository(db_session)

    repository.create(build_comment(organization))

    comments = repository.list(organization_id=organization.id)

    assert len(comments) >= 1


def test_list_comments_excludes_other_organizations(
    db_session: Session,
    organization: Organization,
) -> None:
    """Comments from other organizations are excluded."""
    repository = CommentRepository(db_session)

    repository.create(build_comment(organization))

    comments = repository.list(organization_id=uuid4())

    assert comments == []


def test_list_comments_filters_by_ticket(
    db_session: Session,
    organization: Organization,
) -> None:
    """Comments can be filtered by ticket."""
    repository = CommentRepository(db_session)

    ticket_id = uuid4()

    repository.create(build_comment(organization, ticket_id=ticket_id))
    repository.create(build_comment(organization))

    comments = repository.list(
        organization_id=organization.id,
        ticket_id=ticket_id,
    )

    assert len(comments) == 1
    assert comments[0].ticket_id == ticket_id


def test_list_comments_filters_by_internal_flag(
    db_session: Session,
    organization: Organization,
) -> None:
    """Comments can be filtered by visibility."""
    repository = CommentRepository(db_session)

    repository.create(build_comment(organization, is_internal=True))
    repository.create(build_comment(organization, is_internal=False))

    public_only = repository.list(
        organization_id=organization.id,
        is_internal=False,
    )

    assert len(public_only) == 1
    assert public_only[0].is_internal is False


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
        organization_id=organization.id,
        offset=0,
        limit=3,
    )

    assert len(comments) == 3


def test_comment_author_and_ticket_relationships_resolve(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """The ORM relationships used to build responses resolve correctly."""
    repository = CommentRepository(db_session)

    comment = repository.create(
        build_comment(
            organization,
            ticket_id=ticket.id,
            author_id=user.id,
        )
    )

    fetched = repository.get(comment.id, organization.id)

    assert fetched is not None
    assert fetched.author.id == user.id
    assert fetched.ticket.id == ticket.id

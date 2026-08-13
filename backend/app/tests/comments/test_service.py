"""Comment service tests."""

from __future__ import annotations

from uuid import uuid4

from pytest import raises
from sqlalchemy.orm import Session

from app.comments.exceptions import (
    CommentNotFoundError,
    CommentPermissionDeniedError,
    CommentTicketNotFoundError,
)
from app.comments.repository import CommentRepository
from app.comments.schemas import (
    CreateCommentRequest,
    UpdateCommentRequest,
)
from app.comments.service import CommentService
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User
from app.tickets.repository import TicketRepository


def build_request(
    *,
    content: str = "First comment",
    is_internal: bool = True,
) -> CreateCommentRequest:
    """Build a comment request."""
    return CreateCommentRequest(
        content=content,
        is_internal=is_internal,
    )


def build_service(db_session: Session) -> CommentService:
    """Build a comment service wired to the test database."""
    return CommentService(
        CommentRepository(db_session),
        TicketRepository(db_session),
    )


def test_create_comment(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Create a comment on a ticket in the caller's organization."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    assert comment.id is not None
    assert comment.content == "First comment"
    assert comment.author_id == user.id
    assert comment.ticket_id == ticket.id
    assert comment.is_internal is True


def test_create_comment_rejects_missing_ticket(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject a comment targeting a ticket that does not exist."""
    service = build_service(db_session)

    with raises(CommentTicketNotFoundError):
        service.create_comment(
            organization_id=organization.id,
            author_id=user.id,
            ticket_id=uuid4(),
            request=build_request(),
        )


def test_create_comment_rejects_ticket_from_other_organization(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject a comment targeting a ticket owned by another organization."""
    service = build_service(db_session)

    with raises(CommentTicketNotFoundError):
        service.create_comment(
            organization_id=uuid4(),
            author_id=user.id,
            ticket_id=ticket.id,
            request=build_request(),
        )


def test_get_comment(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Return a comment."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    result = service.get_comment(comment.id, organization.id)

    assert result.id == comment.id


def test_get_comment_wrong_organization_not_found(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """A comment is not visible from another organization."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    with raises(CommentNotFoundError):
        service.get_comment(comment.id, uuid4())


def test_get_missing_comment(
    db_session: Session,
    organization: Organization,
) -> None:
    """Raise comment not found."""
    service = build_service(db_session)

    with raises(CommentNotFoundError):
        service.get_comment(uuid4(), organization.id)


def test_list_comments(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Return comment list scoped to an organization."""
    service = build_service(db_session)

    service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    comments = service.list_comments(organization_id=organization.id)

    assert len(comments) >= 1


def test_update_comment(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Update a comment as its author."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    updated = service.update_comment(
        comment.id,
        organization.id,
        user.id,
        UpdateCommentRequest(
            content="Updated comment",
            is_internal=False,
        ),
    )

    assert updated.content == "Updated comment"
    assert updated.is_internal is False
    assert updated.is_edited is True


def test_update_comment_rejects_non_author(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Only the original author may update a comment."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    with raises(CommentPermissionDeniedError):
        service.update_comment(
            comment.id,
            organization.id,
            uuid4(),
            UpdateCommentRequest(content="Hijacked"),
        )


def test_delete_comment(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Delete a comment as its author."""
    service = build_service(db_session)
    repository = CommentRepository(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    service.delete_comment(comment.id, organization.id, user.id)

    deleted = repository.get(comment.id, organization.id)

    assert deleted is None


def test_delete_comment_rejects_non_author(
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Only the original author may delete a comment."""
    service = build_service(db_session)

    comment = service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=build_request(),
    )

    with raises(CommentPermissionDeniedError):
        service.delete_comment(comment.id, organization.id, uuid4())

"""Tests for ticket repository."""

from __future__ import annotations

from uuid import UUID, uuid4

from app.models.ticket import Ticket
from app.tickets.repository import TicketRepository

ORGANIZATION_ID = UUID("11111111-1111-1111-1111-111111111111")
CREATED_BY = UUID("22222222-2222-2222-2222-222222222222")
ASSIGNED_TO = UUID("33333333-3333-3333-3333-333333333333")


def build_ticket(
    *,
    title: str = "Test Ticket",
) -> Ticket:
    """Build a test ticket."""
    return Ticket(
        organization_id=ORGANIZATION_ID,
        created_by=CREATED_BY,
        assigned_to=ASSIGNED_TO,
        title=title,
        description="Test description",
        priority="medium",
        status="open",
    )


def test_create_ticket(
    ticket_repository: TicketRepository,
) -> None:
    """Create ticket."""
    ticket = build_ticket(
        title="Printer Issue",
    )

    created = ticket_repository.create(ticket)

    assert created.id is not None
    assert created.title == "Printer Issue"


def test_get_ticket(
    ticket_repository: TicketRepository,
) -> None:
    """Get ticket."""
    ticket = ticket_repository.create(
        build_ticket(
            title="Login Issue",
        ),
    )

    found = ticket_repository.get(ticket.id)

    assert found is not None
    assert found.id == ticket.id


def test_get_missing_ticket(
    ticket_repository: TicketRepository,
) -> None:
    """Missing ticket."""
    assert ticket_repository.get(uuid4()) is None


def test_get_by_title(
    ticket_repository: TicketRepository,
) -> None:
    """Lookup by title."""
    ticket = ticket_repository.create(
        build_ticket(
            title="Email Issue",
        ),
    )

    found = ticket_repository.get_by_title(
        "Email Issue",
    )

    assert found is not None
    assert found.id == ticket.id


def test_exists_by_title(
    ticket_repository: TicketRepository,
) -> None:
    """Title exists."""
    ticket_repository.create(
        build_ticket(
            title="VPN Issue",
        ),
    )

    assert ticket_repository.exists_by_title(
        "VPN Issue",
    )

    assert not ticket_repository.exists_by_title(
        "Unknown",
    )


def test_list_tickets(
    ticket_repository: TicketRepository,
) -> None:
    """List tickets."""
    ticket_repository.create(
        build_ticket(title="Ticket A"),
    )

    ticket_repository.create(
        build_ticket(title="Ticket B"),
    )

    tickets = ticket_repository.list()

    assert len(tickets) >= 2


def test_update_ticket(
    ticket_repository: TicketRepository,
) -> None:
    """Update ticket."""
    ticket = ticket_repository.create(
        build_ticket(
            title="Old Title",
        ),
    )

    ticket.title = "New Title"

    updated = ticket_repository.update(
        ticket,
    )

    assert updated.title == "New Title"


def test_delete_ticket(
    ticket_repository: TicketRepository,
) -> None:
    """Soft delete."""
    ticket = ticket_repository.create(
        build_ticket(
            title="Delete Ticket",
        ),
    )

    ticket_repository.delete(ticket)

    assert ticket_repository.get(ticket.id) is None

    assert (
        ticket_repository.get_by_title(
            "Delete Ticket",
        )
        is None
    )


def test_ticket_pagination(
    ticket_repository: TicketRepository,
) -> None:
    """Pagination."""
    for index in range(5):
        ticket_repository.create(
            build_ticket(
                title=f"Ticket {index}",
            ),
        )

    tickets = ticket_repository.list(
        offset=0,
        limit=2,
    )

    assert len(tickets) == 2

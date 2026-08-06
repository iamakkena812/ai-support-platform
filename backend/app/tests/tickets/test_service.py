"""Tests for the ticket service."""

from __future__ import annotations

from uuid import uuid4

import pytest

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.organization import Organization
from app.models.user import User
from app.tickets.constants import (
    TicketPriority,
    TicketStatus,
)
from app.tickets.repository import TicketRepository
from app.tickets.schemas import (
    CreateTicketRequest,
    UpdateTicketRequest,
)
from app.tickets.service import TicketService


@pytest.fixture
def ticket_service(
    ticket_repository: TicketRepository,
) -> TicketService:
    """Return a ticket service."""
    return TicketService(ticket_repository)


def build_request(
    user: User,
    *,
    title: str,
) -> CreateTicketRequest:
    """Build a ticket creation request."""
    return CreateTicketRequest(
        assigned_to=user.id,
        title=title,
        description="Description",
        priority=TicketPriority.MEDIUM,
        status=TicketStatus.OPEN,
    )


def test_create_ticket(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """Create a ticket."""
    request = build_request(
        user,
        title="Printer Issue",
    )

    ticket = ticket_service.create_ticket(
        organization_id=organization.id,
        created_by=user.id,
        request=request,
    )

    assert ticket.id is not None
    assert ticket.title == "Printer Issue"


def test_duplicate_title(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """Duplicate titles are rejected."""
    request = build_request(
        user,
        title="Duplicate",
    )

    ticket_service.create_ticket(
        organization_id=organization.id,
        created_by=user.id,
        request=request,
    )

    with pytest.raises(ConflictException):
        ticket_service.create_ticket(
            organization_id=organization.id,
            created_by=user.id,
            request=request,
        )


def test_get_ticket(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """Return a ticket."""
    created = ticket_service.create_ticket(
        organization_id=organization.id,
        created_by=user.id,
        request=build_request(
            user,
            title="Login Issue",
        ),
    )

    ticket = ticket_service.get_ticket(created.id)

    assert ticket.id == created.id


def test_get_missing_ticket(
    ticket_service: TicketService,
) -> None:
    """Missing ticket raises."""
    with pytest.raises(ResourceNotFoundException):
        ticket_service.get_ticket(uuid4())


def test_list_tickets(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """List tickets."""
    for index in range(3):
        ticket_service.create_ticket(
            organization_id=organization.id,
            created_by=user.id,
            request=build_request(
                user,
                title=f"Ticket {index}",
            ),
        )

    tickets = ticket_service.list_tickets()

    assert len(tickets) >= 3


def test_update_ticket(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """Update a ticket."""
    created = ticket_service.create_ticket(
        organization_id=organization.id,
        created_by=user.id,
        request=build_request(
            user,
            title="Old Title",
        ),
    )

    updated = ticket_service.update_ticket(
        created.id,
        UpdateTicketRequest(
            title="New Title",
            description="New Description",
            priority=TicketPriority.HIGH,
            status=TicketStatus.CLOSED,
        ),
    )

    assert updated.title == "New Title"
    assert updated.description == "New Description"


def test_delete_ticket(
    ticket_service: TicketService,
    organization: Organization,
    user: User,
) -> None:
    """Delete a ticket."""
    created = ticket_service.create_ticket(
        organization_id=organization.id,
        created_by=user.id,
        request=build_request(
            user,
            title="Delete Ticket",
        ),
    )

    ticket_service.delete_ticket(created.id)

    with pytest.raises(ResourceNotFoundException):
        ticket_service.get_ticket(created.id)

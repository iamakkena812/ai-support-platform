"""Ticket service."""

from __future__ import annotations

from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.ticket import Ticket
from app.tickets.repository import TicketRepository
from app.tickets.schemas import (
    CreateTicketRequest,
    UpdateTicketRequest,
)


class TicketService:
    """Business logic for ticket management."""

    def __init__(
        self,
        repository: TicketRepository,
    ) -> None:
        """Initialize the ticket service."""
        self._repository = repository

    def create_ticket(
        self,
        *,
        organization_id: UUID,
        created_by: UUID,
        request: CreateTicketRequest,
    ) -> Ticket:
        """Create a new ticket."""
        if self._repository.exists_by_title(request.title):
            raise ConflictException(
                "Ticket title already exists.",
            )

        ticket = Ticket(
            organization_id=organization_id,
            created_by=created_by,
            assigned_to=request.assigned_to,
            title=request.title,
            description=request.description,
            priority=request.priority,
            status=request.status,
            is_active=True,
        )

        return self._repository.create(ticket)

    def get_ticket(
        self,
        ticket_id: UUID,
    ) -> Ticket:
        """Return a ticket by its identifier."""
        ticket = self._repository.get(ticket_id)

        if ticket is None:
            raise ResourceNotFoundException(
                "Ticket not found.",
            )

        return ticket

    def list_tickets(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Ticket]:
        """Return a paginated list of tickets."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def update_ticket(
        self,
        ticket_id: UUID,
        request: UpdateTicketRequest,
    ) -> Ticket:
        """Update an existing ticket."""
        ticket = self.get_ticket(ticket_id)

        if request.title is not None and request.title != ticket.title:
            if self._repository.exists_by_title(
                request.title,
            ):
                raise ConflictException(
                    "Ticket title already exists.",
                )

            ticket.title = request.title

        if request.description is not None:
            ticket.description = request.description

        if request.priority is not None:
            ticket.priority = request.priority

        if request.status is not None:
            ticket.status = request.status

        if request.assigned_to is not None:
            ticket.assigned_to = request.assigned_to

        if request.is_active is not None:
            ticket.is_active = request.is_active

        return self._repository.update(ticket)

    def delete_ticket(
        self,
        ticket_id: UUID,
    ) -> None:
        """Delete a ticket."""
        ticket = self.get_ticket(ticket_id)

        self._repository.delete(ticket)

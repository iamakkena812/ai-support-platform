"""Ticket repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ticket import Ticket


class TicketRepository:
    """Repository for ticket persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        ticket: Ticket,
    ) -> Ticket:
        """Create a ticket."""
        self._session.add(ticket)
        self._session.commit()
        self._session.refresh(ticket)

        return ticket

    def get(
        self,
        ticket_id: UUID,
    ) -> Ticket | None:
        """Return a ticket by ID."""
        statement = select(Ticket).where(
            Ticket.id == ticket_id,
            Ticket.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def get_by_title(
        self,
        title: str,
    ) -> Ticket | None:
        """Return a ticket by title."""
        statement = select(Ticket).where(
            Ticket.title == title,
            Ticket.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def exists_by_title(
        self,
        title: str,
    ) -> bool:
        """Return whether a ticket title already exists."""
        return self.get_by_title(title) is not None

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Ticket]:
        """Return a paginated list of tickets."""
        statement = (
            select(Ticket)
            .where(Ticket.is_deleted.is_(False))
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement).all())

    def update(
        self,
        ticket: Ticket,
    ) -> Ticket:
        """Update a ticket."""
        self._session.add(ticket)
        self._session.commit()
        self._session.refresh(ticket)

        return ticket

    def delete(
        self,
        ticket: Ticket,
    ) -> None:
        """Soft delete a ticket."""
        ticket.soft_delete()

        self._session.add(ticket)
        self._session.commit()
        self._session.refresh(ticket)

"""Dependencies for the tickets module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.tickets.repository import TicketRepository
from app.tickets.service import TicketService

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_ticket_service(
    session: DatabaseSession,
) -> TicketService:
    """Return ticket service."""
    repository = TicketRepository(session)
    return TicketService(repository)

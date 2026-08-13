"""Dependency injection for the SLA module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.tickets.repository import TicketRepository

from .repository import SLARepository
from .service import SLAService


def get_sla_repository(
    db: Annotated[Session, Depends(get_db)],
) -> SLARepository:
    """Return an SLA repository instance."""
    return SLARepository(db)


def get_ticket_repository(
    db: Annotated[Session, Depends(get_db)],
) -> TicketRepository:
    """Return a ticket repository instance."""
    return TicketRepository(db)


def get_sla_service(
    repository: Annotated[SLARepository, Depends(get_sla_repository)],
    ticket_repository: Annotated[
        TicketRepository,
        Depends(get_ticket_repository),
    ],
) -> SLAService:
    """Return an SLA service instance."""
    return SLAService(repository, ticket_repository)

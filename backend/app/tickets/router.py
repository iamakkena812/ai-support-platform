"""Ticket router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import DatabaseDependency
from app.models import User
from app.rbac.dependencies import require_permission
from app.tickets.repository import TicketRepository
from app.tickets.schemas import (
    CreateTicketRequest,
    TicketResponse,
)
from app.tickets.service import TicketService

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


def get_ticket_service(
    db: DatabaseDependency,
) -> TicketService:
    """Return a ticket service."""
    repository = TicketRepository(db)

    return TicketService(repository)


TicketServiceDependency = Annotated[
    TicketService,
    Depends(get_ticket_service),
]

TicketReadPermission = Depends(
    require_permission(
        "ticket",
        "read",
    ),
)

TicketCreatePermission = Depends(
    require_permission(
        "ticket",
        "create",
    ),
)


@router.get(
    "",
    response_model=list[TicketResponse],
    status_code=status.HTTP_200_OK,
    summary="List tickets",
)
async def list_tickets(
    service: TicketServiceDependency,
    current_user: User = TicketReadPermission,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[TicketResponse]:
    """Return a paginated list of tickets."""
    tickets = service.list_tickets(
        offset=offset,
        limit=limit,
    )

    return [TicketResponse.model_validate(ticket) for ticket in tickets]


@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create ticket",
)
async def create_ticket(
    request: CreateTicketRequest,
    service: TicketServiceDependency,
    current_user: User = TicketCreatePermission,
) -> TicketResponse:
    """Create a ticket."""
    ticket = service.create_ticket(
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        request=request,
    )

    return TicketResponse.model_validate(ticket)

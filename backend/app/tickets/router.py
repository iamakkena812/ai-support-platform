"""Ticket router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import DatabaseDependency
from app.models import User
from app.rbac.dependencies import require_permission
from app.tickets.repository import TicketRepository
from app.tickets.schemas import (
    CreateTicketRequest,
    TicketListResponse,
    TicketResponse,
    UpdateTicketRequest,
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

TicketUpdatePermission = Depends(
    require_permission(
        "ticket",
        "update",
    ),
)

TicketDeletePermission = Depends(
    require_permission(
        "ticket",
        "delete",
    ),
)


@router.get(
    "",
    response_model=TicketListResponse,
    status_code=status.HTTP_200_OK,
    summary="List tickets",
)
async def list_tickets(
    service: TicketServiceDependency,
    current_user: User = TicketReadPermission,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100, alias="pageSize")] = 20,
) -> TicketListResponse:
    """Return a paginated list of tickets."""
    offset = (page - 1) * page_size

    tickets = service.list_tickets(
        offset=offset,
        limit=page_size,
    )
    total = service.count_tickets()

    return TicketListResponse(
        items=[TicketResponse.model_validate(ticket) for ticket in tickets],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


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


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ticket",
)
async def get_ticket(
    ticket_id: UUID,
    service: TicketServiceDependency,
    current_user: User = TicketReadPermission,
) -> TicketResponse:
    """Return a ticket by its identifier."""
    ticket = service.get_ticket(ticket_id)

    return TicketResponse.model_validate(ticket)


@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Update ticket",
)
async def update_ticket(
    ticket_id: UUID,
    request: UpdateTicketRequest,
    service: TicketServiceDependency,
    current_user: User = TicketUpdatePermission,
) -> TicketResponse:
    """Update an existing ticket."""
    ticket = service.update_ticket(
        ticket_id,
        request,
    )

    return TicketResponse.model_validate(ticket)


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete ticket",
)
async def delete_ticket(
    ticket_id: UUID,
    service: TicketServiceDependency,
    current_user: User = TicketDeletePermission,
) -> None:
    """Delete a ticket."""
    service.delete_ticket(ticket_id)

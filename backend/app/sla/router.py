"""API router for SLA management."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status

from .constants import SLA_PREFIX, SLA_TAG
from .dependencies import get_sla_service
from .models import SLAEvent, SLAPolicy
from .schemas import (
    BreachedTicket,
    SLAEventRead,
    SLAPolicyCreate,
    SLAPolicyRead,
    SLAPolicyUpdate,
)
from .service import SLAService

router = APIRouter(
    prefix=SLA_PREFIX,
    tags=[SLA_TAG],
)


@router.get(
    "/policies",
    response_model=list[SLAPolicyRead],
)
def list_policies(
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> list[SLAPolicy]:
    """Return all SLA policies."""
    return service.list_policies()


@router.post(
    "/policies",
    response_model=SLAPolicyRead,
    status_code=status.HTTP_201_CREATED,
)
def create_policy(
    payload: SLAPolicyCreate,
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> SLAPolicy:
    """Create an SLA policy."""
    return service.create_policy(payload)


@router.get(
    "/policies/{policy_id}",
    response_model=SLAPolicyRead,
)
def get_policy(
    policy_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> SLAPolicy:
    """Return an SLA policy."""
    return service.get_policy(policy_id)


@router.patch(
    "/policies/{policy_id}",
    response_model=SLAPolicyRead,
)
def update_policy(
    policy_id: UUID,
    payload: SLAPolicyUpdate,
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> SLAPolicy:
    """Update an SLA policy."""
    return service.update_policy(policy_id, payload)


@router.delete(
    "/policies/{policy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_policy(
    policy_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> Response:
    """Delete an SLA policy."""
    service.delete_policy(policy_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/breached",
    response_model=list[BreachedTicket],
)
def list_breached(
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> list[BreachedTicket]:
    """Return breached SLA tickets."""
    events = service.list_breached_tickets()

    return [
        BreachedTicket(
            ticket_id=event.ticket_id,
            policy_id=event.policy_id,
            first_response_breached=event.first_response_breached,
            resolution_breached=event.resolution_breached,
        )
        for event in events
    ]


@router.get(
    "/tickets/{ticket_id}",
    response_model=SLAEventRead,
)
def get_ticket_sla(
    ticket_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
) -> SLAEvent:
    """Return the SLA event for a ticket."""
    return service.get_sla_event(ticket_id)

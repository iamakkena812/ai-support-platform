"""API router for SLA management."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.auth.dependencies import CurrentActiveUserDependency

from .constants import SLA_PREFIX, SLA_TAG
from .dependencies import get_sla_service
from .models import SLAEvent, SLAPolicy
from .schemas import (
    BreachedTicket,
    SLAEventRead,
    SLAPolicyAssignRequest,
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
    current_user: CurrentActiveUserDependency,
    active_only: bool = Query(default=False),
) -> list[SLAPolicy]:
    """Return SLA policies belonging to the caller's organization."""
    return service.list_policies(
        current_user.organization_id,
        active_only=active_only,
    )


@router.post(
    "/policies",
    response_model=SLAPolicyRead,
    status_code=status.HTTP_201_CREATED,
)
def create_policy(
    payload: SLAPolicyCreate,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAPolicy:
    """Create an SLA policy owned by the caller's organization."""
    return service.create_policy(payload, current_user.organization_id)


@router.get(
    "/policies/{policy_id}",
    response_model=SLAPolicyRead,
)
def get_policy(
    policy_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAPolicy:
    """Return an SLA policy belonging to the caller's organization."""
    return service.get_policy(policy_id, current_user.organization_id)


@router.patch(
    "/policies/{policy_id}",
    response_model=SLAPolicyRead,
)
def update_policy(
    policy_id: UUID,
    payload: SLAPolicyUpdate,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAPolicy:
    """Update an SLA policy belonging to the caller's organization."""
    return service.update_policy(
        policy_id,
        current_user.organization_id,
        payload,
    )


@router.delete(
    "/policies/{policy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_policy(
    policy_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> Response:
    """Delete an SLA policy belonging to the caller's organization."""
    service.delete_policy(policy_id, current_user.organization_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/breached",
    response_model=list[BreachedTicket],
)
def list_breached(
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> list[BreachedTicket]:
    """Return breached SLA tickets for the caller's organization."""
    events = service.list_breached_tickets(current_user.organization_id)

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
    current_user: CurrentActiveUserDependency,
) -> SLAEvent:
    """Return the SLA event for a ticket in the caller's organization."""
    return service.get_sla_event(ticket_id, current_user.organization_id)


@router.post(
    "/tickets/{ticket_id}/assign",
    response_model=SLAEventRead,
    status_code=status.HTTP_201_CREATED,
)
def assign_policy(
    ticket_id: UUID,
    payload: SLAPolicyAssignRequest,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAEvent:
    """Assign an SLA policy to a ticket in the caller's organization."""
    return service.assign_policy(
        ticket_id,
        current_user.organization_id,
        payload.policy_id,
    )


@router.post(
    "/tickets/{ticket_id}/first-response",
    response_model=SLAEventRead,
)
def record_first_response(
    ticket_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAEvent:
    """Record the first response for a ticket's SLA event."""
    return service.record_first_response(
        ticket_id,
        current_user.organization_id,
    )


@router.post(
    "/tickets/{ticket_id}/resolve",
    response_model=SLAEventRead,
)
def resolve_ticket(
    ticket_id: UUID,
    service: Annotated[SLAService, Depends(get_sla_service)],
    current_user: CurrentActiveUserDependency,
) -> SLAEvent:
    """Record resolution for a ticket's SLA event."""
    return service.resolve_ticket(
        ticket_id,
        current_user.organization_id,
    )

"""Tests for SLAService."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.ticket import Ticket
from app.sla.constants import SLAPriority
from app.sla.exceptions import (
    InactiveSLAPolicyException,
    SLAPolicyNotFoundException,
    SLATicketNotFoundException,
)
from app.sla.models import SLAEvent, SLAPolicy
from app.sla.repository import SLARepository
from app.sla.schemas import (
    SLAPolicyCreate,
    SLAPolicyUpdate,
)
from app.sla.service import SLAService
from app.tickets.repository import TicketRepository


@pytest.fixture
def service(
    db_session: Session,
) -> SLAService:
    """Return an SLA service."""
    repository = SLARepository(db_session)
    ticket_repository = TicketRepository(db_session)
    return SLAService(repository, ticket_repository)


def test_get_policy(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test retrieving an SLA policy."""
    policy = service.get_policy(
        sla_policy.id,
        sla_policy.organization_id,
    )

    assert policy.id == sla_policy.id
    assert policy.name == sla_policy.name


def test_get_policy_isolated_from_other_organization(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """A policy is invisible when queried under another organization."""
    with pytest.raises(SLAPolicyNotFoundException):
        service.get_policy(sla_policy.id, uuid4())


def test_list_policies(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing SLA policies."""
    policies = service.list_policies(sla_policy.organization_id)

    assert sla_policy in policies


def test_list_policies_isolated_from_other_organization(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Listing under another organization returns no results."""
    policies = service.list_policies(uuid4())

    assert policies == []


def test_create_policy(
    service: SLAService,
    organization: Organization,
) -> None:
    """Test creating an SLA policy."""
    request = SLAPolicyCreate(
        name="Critical",
        description="Critical SLA",
        priority=SLAPriority.HIGH,
        first_response_minutes=30,
        resolution_minutes=240,
        business_hours_only=False,
        is_active=True,
    )

    policy = service.create_policy(request, organization.id)

    assert policy.name == request.name
    assert policy.priority == request.priority
    assert policy.first_response_minutes == 30
    assert policy.resolution_minutes == 240
    assert policy.organization_id == organization.id


def test_update_policy(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test updating an SLA policy."""
    request = SLAPolicyUpdate(
        name="Updated SLA",
    )

    updated = service.update_policy(
        sla_policy.id,
        sla_policy.organization_id,
        request,
    )

    assert updated.name == "Updated SLA"


def test_update_policy_rejects_other_organization(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Updating a policy from another organization is rejected."""
    with pytest.raises(SLAPolicyNotFoundException):
        service.update_policy(
            sla_policy.id,
            uuid4(),
            SLAPolicyUpdate(name="Hijacked"),
        )


def test_delete_policy(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test deleting an SLA policy."""
    service.delete_policy(
        sla_policy.id,
        sla_policy.organization_id,
    )

    with pytest.raises(
        SLAPolicyNotFoundException,
    ):
        service.get_policy(
            sla_policy.id,
            sla_policy.organization_id,
        )


def test_assign_policy(
    service: SLAService,
    ticket: Ticket,
    sla_policy: SLAPolicy,
) -> None:
    """Test assigning an SLA policy."""
    event = service.assign_policy(
        ticket.id,
        ticket.organization_id,
        sla_policy.id,
    )

    assert event.ticket_id == ticket.id
    assert event.policy_id == sla_policy.id


def test_assign_policy_rejects_ticket_from_other_organization(
    service: SLAService,
    sla_policy: SLAPolicy,
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A ticket from another organization cannot be assigned a policy."""
    other_organization = Organization(
        name="Other SLA Org",
        code=f"OTHERSLA-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-sla.com",
        phone="+919999999991",
        website="https://other-sla.com",
        logo_url="https://other-sla.com/logo.png",
        address="1 Other SLA Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500009",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    with pytest.raises(SLATicketNotFoundException):
        service.assign_policy(
            ticket.id,
            other_organization.id,
            sla_policy.id,
        )


def test_assign_policy_missing_ticket_raises(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Assigning a policy to a nonexistent ticket is rejected."""
    with pytest.raises(SLATicketNotFoundException):
        service.assign_policy(
            uuid4(),
            sla_policy.organization_id,
            sla_policy.id,
        )


def test_assign_inactive_policy_raises(
    db_session: Session,
    service: SLAService,
    sla_policy: SLAPolicy,
    ticket: Ticket,
) -> None:
    """Inactive policies cannot be assigned."""
    sla_policy.is_active = False
    db_session.commit()

    with pytest.raises(
        InactiveSLAPolicyException,
    ):
        service.assign_policy(
            ticket.id,
            ticket.organization_id,
            sla_policy.id,
        )


def test_calculate_due_dates(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test SLA due date calculation."""
    started = datetime.now(UTC)

    first_due, resolution_due = service.calculate_due_dates(
        sla_policy,
        started,
    )

    assert first_due == started + timedelta(
        minutes=sla_policy.first_response_minutes,
    )

    assert resolution_due == started + timedelta(
        minutes=sla_policy.resolution_minutes,
    )


def test_record_first_response(
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Test recording first response."""
    event = service.record_first_response(
        sla_event.ticket_id,
        ticket.organization_id,
    )

    assert event.first_response_at is not None


def test_record_first_response_rejects_other_organization(
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Recording a response for another organization's ticket is rejected."""
    with pytest.raises(SLATicketNotFoundException):
        service.record_first_response(
            sla_event.ticket_id,
            uuid4(),
        )


def test_resolve_ticket(
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Test resolving ticket."""
    event = service.resolve_ticket(
        sla_event.ticket_id,
        ticket.organization_id,
    )

    assert event.resolved_at is not None


def test_first_response_breach_detection(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Test first response breach detection."""
    sla_event.first_response_due = datetime.now(UTC) - timedelta(minutes=5)

    db_session.commit()

    assert service.is_first_response_breached(
        sla_event.ticket_id,
        ticket.organization_id,
    )


def test_resolution_breach_detection(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Test resolution breach detection."""
    sla_event.resolution_due = datetime.now(UTC) - timedelta(minutes=5)

    db_session.commit()

    assert service.is_resolution_breached(
        sla_event.ticket_id,
        ticket.organization_id,
    )


def test_list_breached_tickets(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing breached tickets."""
    sla_event.first_response_breached = True
    db_session.commit()

    events = service.list_breached_tickets(sla_policy.organization_id)

    assert len(events) == 1
    assert events[0].ticket_id == sla_event.ticket_id


def test_list_breached_tickets_isolated_from_other_organization(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Breached tickets are not visible under another organization."""
    sla_event.first_response_breached = True
    db_session.commit()

    events = service.list_breached_tickets(uuid4())

    assert events == []


def test_get_sla_event(
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Test retrieving an SLA event."""
    event = service.get_sla_event(
        sla_event.ticket_id,
        ticket.organization_id,
    )

    assert event.id == sla_event.id


def test_get_sla_event_isolated_from_other_organization(
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """An SLA event is invisible under another organization."""
    with pytest.raises(SLATicketNotFoundException):
        service.get_sla_event(sla_event.ticket_id, uuid4())


def test_list_active_policies(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Only active policies should be returned."""
    policies = service.list_policies(
        sla_policy.organization_id,
        active_only=True,
    )

    assert sla_policy in policies


def test_record_first_response_marks_breached(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Late first response marks SLA breached."""
    sla_event.first_response_due = datetime.now(UTC) - timedelta(minutes=10)

    db_session.commit()

    event = service.record_first_response(
        sla_event.ticket_id,
        ticket.organization_id,
    )

    assert event.first_response_breached is True


def test_resolve_ticket_marks_breached(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
    ticket: Ticket,
) -> None:
    """Late resolution marks SLA breached."""
    sla_event.resolution_due = datetime.now(UTC) - timedelta(minutes=10)

    db_session.commit()

    event = service.resolve_ticket(
        sla_event.ticket_id,
        ticket.organization_id,
    )

    assert event.resolution_breached is True

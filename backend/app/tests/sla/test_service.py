"""Tests for SLAService."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.sla.constants import SLAPriority
from app.sla.exceptions import InactiveSLAPolicyException, SLAPolicyNotFoundException
from app.sla.models import SLAEvent, SLAPolicy
from app.sla.repository import SLARepository
from app.sla.schemas import (
    SLAPolicyCreate,
    SLAPolicyUpdate,
)
from app.sla.service import SLAService
from sqlalchemy.orm import Session


@pytest.fixture
def service(
    db_session: Session,
) -> SLAService:
    """Return an SLA service."""
    repository = SLARepository(db_session)
    return SLAService(repository)


def test_get_policy(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test retrieving an SLA policy."""
    policy = service.get_policy(
        sla_policy.id,
    )

    assert policy.id == sla_policy.id
    assert policy.name == sla_policy.name


def test_list_policies(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing SLA policies."""
    policies = service.list_policies()

    assert sla_policy in policies


def test_create_policy(
    service: SLAService,
    organization: Organization,
) -> None:
    """Test creating an SLA policy."""
    request = SLAPolicyCreate(
        organization_id=organization.id,
        name="Critical",
        description="Critical SLA",
        priority=SLAPriority.HIGH,
        first_response_minutes=30,
        resolution_minutes=240,
        business_hours_only=False,
        is_active=True,
    )

    policy = service.create_policy(request)

    assert policy.name == request.name
    assert policy.priority == request.priority
    assert policy.first_response_minutes == 30
    assert policy.resolution_minutes == 240


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
        request,
    )

    assert updated.name == "Updated SLA"


def test_delete_policy(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Test deleting an SLA policy."""
    service.delete_policy(
        sla_policy.id,
    )

    with pytest.raises(
        SLAPolicyNotFoundException,
    ):
        service.get_policy(
            sla_policy.id,
        )


def test_assign_policy(
    service: SLAService,
    ticket: Ticket,
    sla_policy: SLAPolicy,
) -> None:
    """Test assigning an SLA policy."""
    event = service.assign_policy(
        ticket.id,
        sla_policy.id,
    )

    assert event.ticket_id == ticket.id
    assert event.policy_id == sla_policy.id


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
) -> None:
    """Test recording first response."""
    event = service.record_first_response(
        sla_event.ticket_id,
    )

    assert event.first_response_at is not None


def test_resolve_ticket(
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Test resolving ticket."""
    event = service.resolve_ticket(
        sla_event.ticket_id,
    )

    assert event.resolved_at is not None


def test_first_response_breach_detection(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Test first response breach detection."""
    sla_event.first_response_due = datetime.now(UTC) - timedelta(minutes=5)

    db_session.commit()

    assert service.is_first_response_breached(
        sla_event.ticket_id,
    )


def test_resolution_breach_detection(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Test resolution breach detection."""
    sla_event.resolution_due = datetime.now(UTC) - timedelta(minutes=5)

    db_session.commit()

    assert service.is_resolution_breached(
        sla_event.ticket_id,
    )


def test_list_breached_tickets(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Test listing breached tickets."""
    sla_event.first_response_breached = True
    db_session.commit()

    events = service.list_breached_tickets()

    assert len(events) == 1
    assert events[0].ticket_id == sla_event.ticket_id


def test_get_sla_event(
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Test retrieving an SLA event."""
    event = service.get_sla_event(
        sla_event.ticket_id,
    )

    assert event.id == sla_event.id


def test_list_active_policies(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Only active policies should be returned."""
    policies = service.list_policies(
        active_only=True,
    )

    assert sla_policy in policies


def test_list_policies_by_organization(
    service: SLAService,
    sla_policy: SLAPolicy,
) -> None:
    """Filter policies by organization."""
    policies = service.list_policies(
        organization_id=sla_policy.organization_id,
    )

    assert sla_policy in policies


def test_record_first_response_marks_breached(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Late first response marks SLA breached."""
    sla_event.first_response_due = datetime.now(UTC) - timedelta(minutes=10)

    db_session.commit()

    event = service.record_first_response(
        sla_event.ticket_id,
    )

    assert event.first_response_breached is True


def test_resolve_ticket_marks_breached(
    db_session: Session,
    service: SLAService,
    sla_event: SLAEvent,
) -> None:
    """Late resolution marks SLA breached."""
    sla_event.resolution_due = datetime.now(UTC) - timedelta(minutes=10)

    db_session.commit()

    event = service.resolve_ticket(
        sla_event.ticket_id,
    )

    assert event.resolution_breached is True

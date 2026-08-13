"""Tests for SLARepository."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.ticket import Ticket
from app.sla.exceptions import SLAPolicyNotFoundException
from app.sla.models import SLAEvent, SLAPolicy
from app.sla.repository import SLARepository


@pytest.fixture
def repository(
    db_session: Session,
) -> SLARepository:
    """Return an SLA repository."""
    return SLARepository(db_session)


@pytest.fixture
def sla_policy(
    db_session: Session,
    organization: Organization,
) -> SLAPolicy:
    """Create a persisted SLA policy."""
    policy = SLAPolicy(
        organization_id=organization.id,
        name="Default SLA",
        description="Default policy",
        priority="medium",
        first_response_minutes=60,
        resolution_minutes=480,
        business_hours_only=False,
        is_active=True,
    )

    db_session.add(policy)
    db_session.commit()
    db_session.refresh(policy)

    return policy


@pytest.fixture
def sla_event(
    db_session: Session,
    ticket: Ticket,
    sla_policy: SLAPolicy,
) -> SLAEvent:
    """Create a persisted SLA event."""
    now = datetime.now(UTC)

    event = SLAEvent(
        ticket_id=ticket.id,
        policy_id=sla_policy.id,
        started_at=now,
        first_response_due=now + timedelta(minutes=60),
        resolution_due=now + timedelta(minutes=480),
        first_response_breached=False,
        resolution_breached=False,
    )

    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)

    return event


def test_get_policy(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """Test retrieving a policy scoped to its organization."""
    result = repository.get_policy(sla_policy.id, sla_policy.organization_id)

    assert result.id == sla_policy.id


def test_get_policy_isolated_from_other_organization(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """A policy is invisible when queried under another organization."""
    with pytest.raises(SLAPolicyNotFoundException):
        repository.get_policy(sla_policy.id, uuid4())


def test_list_policies(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing policies scoped to an organization."""
    result = repository.list_policies(sla_policy.organization_id)

    assert sla_policy in result


def test_list_policies_isolated_from_other_organization(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """Listing under another organization returns no results."""
    result = repository.list_policies(uuid4())

    assert result == []


def test_update_policy(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """Test updating a policy."""
    sla_policy.name = "Updated SLA"

    updated = repository.update_policy(
        sla_policy,
        data=type(
            "Update",
            (),
            {
                "model_dump": lambda self, exclude_unset=True: {
                    "name": "Updated SLA",
                },
            },
        )(),
    )

    assert updated.name == "Updated SLA"


def test_delete_policy(
    repository: SLARepository,
    sla_policy: SLAPolicy,
) -> None:
    """Test deleting a policy."""
    organization_id = sla_policy.organization_id

    repository.delete_policy(sla_policy)

    assert repository.list_policies(organization_id) == []


def test_get_sla_event(
    repository: SLARepository,
    sla_event: SLAEvent,
) -> None:
    """Test retrieving an SLA event."""
    result = repository.get_sla_event(
        sla_event.ticket_id,
    )

    assert result.id == sla_event.id


def test_update_sla_event(
    repository: SLARepository,
    sla_event: SLAEvent,
) -> None:
    """Test updating an SLA event."""
    sla_event.first_response_breached = True

    updated = repository.update_sla_event(
        sla_event,
    )

    assert updated.first_response_breached


def test_list_breached(
    repository: SLARepository,
    sla_event: SLAEvent,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing breached events scoped to an organization."""
    sla_event.first_response_breached = True

    repository.update_sla_event(
        sla_event,
    )

    result = repository.list_breached(sla_policy.organization_id)

    assert sla_event in result


def test_list_breached_isolated_from_other_organization(
    repository: SLARepository,
    sla_event: SLAEvent,
) -> None:
    """Breached events are not visible under another organization."""
    sla_event.first_response_breached = True

    repository.update_sla_event(sla_event)

    result = repository.list_breached(uuid4())

    assert result == []

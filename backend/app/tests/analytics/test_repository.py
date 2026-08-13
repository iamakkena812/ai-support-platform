"""Tests for the analytics repository."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from uuid import uuid4

from sqlalchemy.orm import Session

from app.analytics.repository import AnalyticsRepository
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User
from app.sla.models import SLAEvent, SLAPolicy
from app.workflows.models import Workflow


def test_count_users_scoped_to_organization(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    user: User,
) -> None:
    """Count users scoped to the organization."""
    result = analytics_repository.count_users(organization.id)

    assert result >= 1

    other_result = analytics_repository.count_users(uuid4())

    assert other_result == 0


def test_count_active_users(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    user: User,
) -> None:
    """Count active users scoped to the organization."""
    result = analytics_repository.count_active_users(organization.id)

    assert result >= 1


def test_count_projects_scoped_with_none_created(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
) -> None:
    """Count projects for an organization with none created."""
    result = analytics_repository.count_projects(organization.id)

    assert result == 0


def test_count_tickets_scoped_to_organization(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Count tickets scoped to the organization."""
    result = analytics_repository.count_tickets(organization.id)

    assert result == 1

    other_result = analytics_repository.count_tickets(uuid4())

    assert other_result == 0


def test_tickets_by_status(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Group tickets by status."""
    result = analytics_repository.tickets_by_status(organization.id)

    assert result == {"open": 1}


def test_tickets_by_priority(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Group tickets by priority."""
    result = analytics_repository.tickets_by_priority(organization.id)

    assert result == {"medium": 1}


def test_count_tickets_filters_by_date_range(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Filter ticket counts by created_at date range."""
    today = date.today()

    in_range = analytics_repository.count_tickets(
        organization.id,
        start_date=today,
        end_date=today,
    )

    assert in_range == 1

    out_of_range = analytics_repository.count_tickets(
        organization.id,
        start_date=today - timedelta(days=10),
        end_date=today - timedelta(days=5),
    )

    assert out_of_range == 0


def test_count_workflows_scoped_to_organization(
    analytics_repository: AnalyticsRepository,
    db_session: Session,
    organization: Organization,
) -> None:
    """Count workflows scoped to the organization."""
    workflow = Workflow(
        organization_id=organization.id,
        name="Auto-assign",
        trigger="ticket_created",
        is_active=True,
    )
    db_session.add(workflow)
    db_session.commit()

    assert analytics_repository.count_workflows(organization.id) == 1
    assert analytics_repository.count_active_workflows(organization.id) == 1
    assert analytics_repository.count_workflows(uuid4()) == 0


def test_count_sla_policies_and_breaches(
    analytics_repository: AnalyticsRepository,
    db_session: Session,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """Count SLA policies and breaches scoped to the organization."""
    policy = SLAPolicy(
        organization_id=organization.id,
        name="Standard",
        priority="medium",
        first_response_minutes=60,
        resolution_minutes=480,
    )
    db_session.add(policy)
    db_session.commit()
    db_session.refresh(policy)

    event = SLAEvent(
        ticket_id=ticket.id,
        policy_id=policy.id,
        started_at=datetime.now(UTC),
        first_response_due=datetime.now(UTC),
        resolution_due=datetime.now(UTC),
        first_response_breached=True,
        resolution_breached=False,
    )
    db_session.add(event)
    db_session.commit()

    assert analytics_repository.count_sla_policies(organization.id) == 1
    assert analytics_repository.count_sla_breaches(organization.id) == 1
    assert analytics_repository.count_sla_breaches(uuid4()) == 0


def test_organization_counts_are_platform_wide(
    analytics_repository: AnalyticsRepository,
    organization: Organization,
) -> None:
    """Organization counts include every organization on the platform."""
    result = analytics_repository.count_organizations()

    assert result >= 1

    active_result = analytics_repository.count_active_organizations()

    assert active_result >= 1

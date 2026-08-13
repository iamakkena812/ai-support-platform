"""Repository for analytics queries."""

from __future__ import annotations

from datetime import date, datetime, time
from uuid import UUID

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.project import Project
from app.models.ticket import Ticket
from app.models.user import User
from app.sla.models import SLAEvent, SLAPolicy
from app.workflows.models import Workflow


def _date_range_bounds(
    start_date: date | None,
    end_date: date | None,
) -> tuple[datetime | None, datetime | None]:
    """Convert inclusive date bounds into timestamp bounds."""
    start = datetime.combine(start_date, time.min) if start_date else None
    end = datetime.combine(end_date, time.max) if end_date else None

    return start, end


class AnalyticsRepository:
    """Repository providing organization-scoped analytics aggregation."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize repository.

        Args:
            session: Database session.
        """
        self._session = session

    # ------------------------------------------------------------------
    # Platform-wide (superuser only)
    # ------------------------------------------------------------------

    def count_organizations(self) -> int:
        """Return total organizations across the platform."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Organization),
            )
            or 0
        )

    def count_active_organizations(self) -> int:
        """Return active organizations across the platform."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Organization)
                .where(Organization.is_active.is_(True)),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # Users
    # ------------------------------------------------------------------

    def count_users(self, organization_id: UUID) -> int:
        """Return total users in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(User)
                .where(
                    User.organization_id == organization_id,
                    User.is_deleted.is_(False),
                ),
            )
            or 0
        )

    def count_active_users(self, organization_id: UUID) -> int:
        """Return active users in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(User)
                .where(
                    User.organization_id == organization_id,
                    User.is_deleted.is_(False),
                    User.is_active.is_(True),
                ),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # Projects
    # ------------------------------------------------------------------

    def count_projects(self, organization_id: UUID) -> int:
        """Return total projects in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Project)
                .where(
                    Project.organization_id == organization_id,
                    Project.is_deleted.is_(False),
                ),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # Tickets
    # ------------------------------------------------------------------

    @staticmethod
    def _ticket_filters(
        organization_id: UUID,
        start_date: date | None,
        end_date: date | None,
    ) -> list[ColumnElement[bool]]:
        """Build shared ticket filters for organization and date range."""
        filters: list[ColumnElement[bool]] = [
            Ticket.organization_id == organization_id,
            Ticket.is_deleted.is_(False),
        ]

        start, end = _date_range_bounds(start_date, end_date)

        if start is not None:
            filters.append(Ticket.created_at >= start)

        if end is not None:
            filters.append(Ticket.created_at <= end)

        return filters

    def count_tickets(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> int:
        """Return total tickets in an organization within an optional date range."""
        filters = self._ticket_filters(organization_id, start_date, end_date)

        return (
            self._session.scalar(
                select(func.count()).select_from(Ticket).where(*filters),
            )
            or 0
        )

    def tickets_by_status(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> dict[str, int]:
        """Return ticket counts grouped by status."""
        filters = self._ticket_filters(organization_id, start_date, end_date)

        rows = self._session.execute(
            select(Ticket.status, func.count())
            .where(*filters)
            .group_by(Ticket.status),
        ).all()

        return {row[0]: row[1] for row in rows}

    def tickets_by_priority(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> dict[str, int]:
        """Return ticket counts grouped by priority."""
        filters = self._ticket_filters(organization_id, start_date, end_date)

        rows = self._session.execute(
            select(Ticket.priority, func.count())
            .where(*filters)
            .group_by(Ticket.priority),
        ).all()

        return {row[0]: row[1] for row in rows}

    # ------------------------------------------------------------------
    # Workflows
    # ------------------------------------------------------------------

    def count_workflows(self, organization_id: UUID) -> int:
        """Return total workflows in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Workflow)
                .where(
                    Workflow.organization_id == organization_id,
                    Workflow.is_deleted.is_(False),
                ),
            )
            or 0
        )

    def count_active_workflows(self, organization_id: UUID) -> int:
        """Return active workflows in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Workflow)
                .where(
                    Workflow.organization_id == organization_id,
                    Workflow.is_deleted.is_(False),
                    Workflow.is_active.is_(True),
                ),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # SLA
    # ------------------------------------------------------------------

    def count_sla_policies(self, organization_id: UUID) -> int:
        """Return total SLA policies in an organization."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(SLAPolicy)
                .where(SLAPolicy.organization_id == organization_id),
            )
            or 0
        )

    def count_sla_breaches(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> int:
        """Return SLA breaches in an organization within an optional date range."""
        filters: list[ColumnElement[bool]] = [
            SLAPolicy.organization_id == organization_id,
            (SLAEvent.first_response_breached.is_(True))
            | (SLAEvent.resolution_breached.is_(True)),
        ]

        start, end = _date_range_bounds(start_date, end_date)

        if start is not None:
            filters.append(SLAEvent.started_at >= start)

        if end is not None:
            filters.append(SLAEvent.started_at <= end)

        return (
            self._session.scalar(
                select(func.count())
                .select_from(SLAEvent)
                .join(SLAPolicy, SLAEvent.policy_id == SLAPolicy.id)
                .where(*filters),
            )
            or 0
        )

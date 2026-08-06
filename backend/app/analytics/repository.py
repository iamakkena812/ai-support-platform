"""Repository for analytics queries."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.audit.models import AuditLog
from app.email.models import Email
from app.models.organization import Organization
from app.models.project import Project
from app.models.ticket import Ticket
from app.models.user import User
from app.sla.models import SLAEvent, SLAPolicy
from app.workflows.models import Workflow


class AnalyticsRepository:
    """Repository providing analytics queries."""

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
    # Dashboard
    # ------------------------------------------------------------------

    def count_organizations(self) -> int:
        """Return total organizations."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Organization),
            )
            or 0
        )

    def count_users(self) -> int:
        """Return total users."""
        return (
            self._session.scalar(
                select(func.count()).select_from(User),
            )
            or 0
        )

    def count_projects(self) -> int:
        """Return total projects."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Project),
            )
            or 0
        )

    def count_tickets(self) -> int:
        """Return total tickets."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Ticket),
            )
            or 0
        )

    def count_workflows(self) -> int:
        """Return total workflows."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Workflow),
            )
            or 0
        )

    def count_emails(self) -> int:
        """Return total emails."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Email),
            )
            or 0
        )

    def count_audit_logs(self) -> int:
        """Return total audit logs."""
        return (
            self._session.scalar(
                select(func.count()).select_from(AuditLog),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # Ticket Metrics
    # ------------------------------------------------------------------

    def count_open_tickets(self) -> int:
        """Return open tickets."""
        return (
            self._session.scalar(
                select(func.count()).select_from(Ticket).where(Ticket.status == "open"),
            )
            or 0
        )

    def count_pending_tickets(self) -> int:
        """Return pending tickets."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Ticket)
                .where(Ticket.status == "pending"),
            )
            or 0
        )

    def count_resolved_tickets(self) -> int:
        """Return resolved tickets."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Ticket)
                .where(Ticket.status == "resolved"),
            )
            or 0
        )

    def count_closed_tickets(self) -> int:
        """Return closed tickets."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Ticket)
                .where(Ticket.status == "closed"),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # SLA
    # ------------------------------------------------------------------

    def count_sla_policies(self) -> int:
        """Return SLA policies."""
        return (
            self._session.scalar(
                select(func.count()).select_from(SLAPolicy),
            )
            or 0
        )

    def count_sla_breaches(self) -> int:
        """Return SLA breaches."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(SLAEvent)
                .where(
                    (SLAEvent.first_response_breached.is_(True))
                    | (SLAEvent.resolution_breached.is_(True)),
                ),
            )
            or 0
        )

    # ------------------------------------------------------------------
    # Active Metrics
    # ------------------------------------------------------------------

    def count_active_users(self) -> int:
        """Return active users."""
        return (
            self._session.scalar(
                select(func.count()).select_from(User).where(User.is_active.is_(True)),
            )
            or 0
        )

    def count_active_organizations(self) -> int:
        """Return active organizations."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Organization)
                .where(Organization.is_active.is_(True)),
            )
            or 0
        )

    def count_active_workflows(self) -> int:
        """Return active workflows."""
        return (
            self._session.scalar(
                select(func.count())
                .select_from(Workflow)
                .where(Workflow.is_active.is_(True)),
            )
            or 0
        )

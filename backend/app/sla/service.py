"""Service layer for SLA management."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import UUID

from .exceptions import (
    InactiveSLAPolicyException,
)
from .models import SLAEvent, SLAPolicy
from .repository import SLARepository
from .schemas import (
    SLAPolicyCreate,
    SLAPolicyUpdate,
)


class SLAService:
    """Business logic for SLA policies and events."""

    def __init__(self, repository: SLARepository) -> None:
        """Initialize the service."""
        self._repository = repository

    # ------------------------------------------------------------------
    # Policy management
    # ------------------------------------------------------------------

    def create_policy(
        self,
        data: SLAPolicyCreate,
    ) -> SLAPolicy:
        """Create an SLA policy."""
        return self._repository.create_policy(data)

    def get_policy(
        self,
        policy_id: UUID,
    ) -> SLAPolicy:
        """Return an SLA policy."""
        return self._repository.get_policy(policy_id)

    def list_policies(
        self,
        organization_id: UUID | None = None,
        active_only: bool = False,
    ) -> list[SLAPolicy]:
        """Return SLA policies."""
        return self._repository.list_policies(
            organization_id=organization_id,
            active_only=active_only,
        )

    def update_policy(
        self,
        policy_id: UUID,
        data: SLAPolicyUpdate,
    ) -> SLAPolicy:
        """Update an SLA policy."""
        policy = self._repository.get_policy(policy_id)
        return self._repository.update_policy(policy, data)

    def delete_policy(
        self,
        policy_id: UUID,
    ) -> None:
        """Delete an SLA policy."""
        policy = self._repository.get_policy(policy_id)
        self._repository.delete_policy(policy)

    # ------------------------------------------------------------------
    # SLA assignment
    # ------------------------------------------------------------------

    def assign_policy(
        self,
        ticket_id: UUID,
        policy_id: UUID,
    ) -> SLAEvent:
        """Assign an SLA policy to a ticket."""
        policy = self._repository.get_policy(policy_id)

        if not policy.is_active:
            raise InactiveSLAPolicyException()

        started_at = datetime.now(UTC)

        first_due, resolution_due = self.calculate_due_dates(
            policy,
            started_at,
        )

        event = SLAEvent(
            ticket_id=ticket_id,
            policy_id=policy.id,
            started_at=started_at,
            first_response_due=first_due,
            resolution_due=resolution_due,
        )

        return self._repository.create_sla_event(event)

    # ------------------------------------------------------------------
    # Due dates
    # ------------------------------------------------------------------

    def calculate_due_dates(
        self,
        policy: SLAPolicy,
        started_at: datetime,
    ) -> tuple[datetime, datetime]:
        """Calculate SLA due dates."""
        first_due = started_at + timedelta(
            minutes=policy.first_response_minutes,
        )

        resolution_due = started_at + timedelta(
            minutes=policy.resolution_minutes,
        )

        return first_due, resolution_due

    # ------------------------------------------------------------------
    # Tracking
    # ------------------------------------------------------------------

    @staticmethod
    def _ensure_utc(
        dt: datetime,
    ) -> datetime:
        """Return a UTC-aware datetime."""
        if dt.tzinfo is None:
            return dt.replace(tzinfo=UTC)
        return dt

    def record_first_response(
        self,
        ticket_id: UUID,
    ) -> SLAEvent:
        """Record the first customer response."""
        event = self._repository.get_sla_event(ticket_id)

        now = datetime.now(UTC)

        event.first_response_at = now

        due = self._ensure_utc(event.first_response_due)

        event.first_response_breached = now > due

        return self._repository.update_sla_event(event)

    def resolve_ticket(
        self,
        ticket_id: UUID,
    ) -> SLAEvent:
        """Record ticket resolution."""
        event = self._repository.get_sla_event(ticket_id)

        now = datetime.now(UTC)

        event.resolved_at = now

        due = self._ensure_utc(event.resolution_due)

        event.resolution_breached = now > due

        return self._repository.update_sla_event(event)

    # ------------------------------------------------------------------
    # Breach detection
    # ------------------------------------------------------------------

    def is_first_response_breached(
        self,
        ticket_id: UUID,
    ) -> bool:
        """Determine whether the first response SLA is breached."""
        event = self._repository.get_sla_event(ticket_id)

        if event.first_response_at is not None:
            return event.first_response_breached

        due = self._ensure_utc(event.first_response_due)

        return datetime.now(UTC) > due

    def is_resolution_breached(
        self,
        ticket_id: UUID,
    ) -> bool:
        """Determine whether the resolution SLA is breached."""
        event = self._repository.get_sla_event(ticket_id)

        if event.resolved_at is not None:
            return event.resolution_breached

        due = self._ensure_utc(event.resolution_due)

        return datetime.now(UTC) > due

    # ------------------------------------------------------------------
    # Reporting
    # ------------------------------------------------------------------

    def list_breached_tickets(
        self,
    ) -> list[SLAEvent]:
        """Return all breached SLA events."""
        return self._repository.list_breached()

    def get_sla_event(
        self,
        ticket_id: UUID,
    ) -> SLAEvent:
        """Return the SLA event for a ticket."""
        return self._repository.get_sla_event(ticket_id)

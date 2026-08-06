"""Repository for SLA management."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from .exceptions import (
    SLAEventNotFoundException,
    SLAPolicyNotFoundException,
)
from .models import SLAEvent, SLAPolicy
from .schemas import (
    SLAPolicyCreate,
    SLAPolicyUpdate,
)


class SLARepository:
    """Repository for SLA policies and events."""

    def __init__(self, db: Session) -> None:
        """Initialize the repository."""
        self._db = db

    # ------------------------------------------------------------------
    # Policy methods
    # ------------------------------------------------------------------

    def create_policy(self, data: SLAPolicyCreate) -> SLAPolicy:
        """Create an SLA policy."""
        policy = SLAPolicy(**data.model_dump())

        self._db.add(policy)
        self._db.commit()
        self._db.refresh(policy)

        return policy

    def get_policy(self, policy_id: UUID) -> SLAPolicy:
        """Return a policy by ID."""
        policy = self._db.get(SLAPolicy, policy_id)

        if policy is None:
            raise SLAPolicyNotFoundException()

        return policy

    def list_policies(
        self,
        organization_id: UUID | None = None,
        active_only: bool = False,
    ) -> list[SLAPolicy]:
        """Return SLA policies."""
        stmt = select(SLAPolicy)

        if organization_id is not None:
            stmt = stmt.where(
                SLAPolicy.organization_id == organization_id,
            )

        if active_only:
            stmt = stmt.where(
                SLAPolicy.is_active.is_(True),
            )

        stmt = stmt.order_by(SLAPolicy.name)

        return list(self._db.scalars(stmt).all())

    def update_policy(
        self,
        policy: SLAPolicy,
        data: SLAPolicyUpdate,
    ) -> SLAPolicy:
        """Update an SLA policy."""
        updates = data.model_dump(exclude_unset=True)

        for field, value in updates.items():
            setattr(policy, field, value)

        self._db.add(policy)
        self._db.commit()
        self._db.refresh(policy)

        return policy

    def delete_policy(self, policy: SLAPolicy) -> None:
        """Delete an SLA policy."""
        self._db.delete(policy)
        self._db.commit()

    # ------------------------------------------------------------------
    # SLA Event methods
    # ------------------------------------------------------------------

    def create_sla_event(
        self,
        event: SLAEvent,
    ) -> SLAEvent:
        """Persist an SLA event."""
        self._db.add(event)
        self._db.commit()
        self._db.refresh(event)

        return event

    def get_sla_event(
        self,
        ticket_id: UUID,
    ) -> SLAEvent:
        """Return SLA event by ticket."""
        stmt = select(SLAEvent).where(
            SLAEvent.ticket_id == ticket_id,
        )

        event = self._db.scalar(stmt)

        if event is None:
            raise SLAEventNotFoundException()

        return event

    def update_sla_event(
        self,
        event: SLAEvent,
    ) -> SLAEvent:
        """Update an SLA event."""
        self._db.add(event)
        self._db.commit()
        self._db.refresh(event)

        return event

    def list_breached(self) -> list[SLAEvent]:
        """Return breached SLA events."""
        stmt = (
            select(SLAEvent)
            .where(
                (SLAEvent.first_response_breached.is_(True))
                | (SLAEvent.resolution_breached.is_(True))
            )
            .order_by(SLAEvent.resolution_due)
        )

        return list(self._db.scalars(stmt).all())

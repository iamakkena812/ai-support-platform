"""Database models for SLA management."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.ticket import Ticket


class SLAPolicy(Base):
    """Represents an SLA policy."""

    __tablename__ = "sla_policies"

    __table_args__ = (
        Index("ix_sla_policy_organization", "organization_id"),
        Index("ix_sla_policy_priority", "priority"),
        Index("ix_sla_policy_active", "is_active"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    first_response_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    resolution_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    business_hours_only: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    organization: Mapped[Organization] = relationship(
        "Organization",
        back_populates="sla_policies",
    )

    events: Mapped[list[SLAEvent]] = relationship(
        "SLAEvent",
        back_populates="policy",
        cascade="all, delete-orphan",
    )


class SLAEvent(Base):
    """Represents an SLA event for a ticket."""

    __tablename__ = "sla_events"

    __table_args__ = (
        Index("ix_sla_event_ticket", "ticket_id"),
        Index("ix_sla_event_resolution_due", "resolution_due"),
        Index("ix_sla_event_first_due", "first_response_due"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

    ticket_id: Mapped[UUID] = mapped_column(
        ForeignKey("tickets.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    policy_id: Mapped[UUID] = mapped_column(
        ForeignKey("sla_policies.id", ondelete="CASCADE"),
        nullable=False,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    first_response_due: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    resolution_due: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    first_response_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    first_response_breached: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    resolution_breached: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    policy: Mapped[SLAPolicy] = relationship(
        "SLAPolicy",
        back_populates="events",
    )

    ticket: Mapped[Ticket] = relationship(
        "Ticket",
        back_populates="sla_event",
    )

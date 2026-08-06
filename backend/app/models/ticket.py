"""Defines ticket model."""

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.types import GUID
from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User
    from app.sla.models import SLAEvent


class Ticket(BaseModel):
    """Support ticket."""

    __tablename__ = "tickets"

    organization_id: Mapped[UUID] = mapped_column(
        GUID(),
        ForeignKey("organizations.id"),
        nullable=False,
        index=True,
    )

    created_by: Mapped[UUID] = mapped_column(
        GUID(),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    assigned_to: Mapped[UUID | None] = mapped_column(
        GUID(),
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="open",
        nullable=False,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        default="medium",
        nullable=False,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    organization: Mapped[Organization] = relationship(
        "Organization",
        back_populates="tickets",
    )

    creator: Mapped[User] = relationship(
        "User",
        foreign_keys=[created_by],
        back_populates="created_tickets",
    )

    assignee: Mapped[User | None] = relationship(
        "User",
        foreign_keys=[assigned_to],
        back_populates="assigned_tickets",
    )

    sla_event: Mapped[SLAEvent | None] = relationship(
        "SLAEvent",
        back_populates="ticket",
        uselist=False,
    )

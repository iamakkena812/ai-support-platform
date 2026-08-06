"""Organization ORM model."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.user import User

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.sla.models import SLAPolicy


class Organization(BaseModel):
    """Organization entity."""

    __tablename__ = "organizations"

    tickets: Mapped[list[Ticket]] = relationship(
        back_populates="organization",
        cascade="all, delete-orphan",
    )

    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(25),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    logo_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    country: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    postal_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        default="UTC",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    users: Mapped[list[User]] = relationship(
        back_populates="organization",
        cascade="all, delete-orphan",
    )

    sla_policies: Mapped[list[SLAPolicy]] = relationship(
        "SLAPolicy",
        back_populates="organization",
        cascade="all, delete-orphan",
    )

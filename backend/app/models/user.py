"""User ORM model."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.ticket import Ticket
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.mixins import OrganizationMixin

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user_role import UserRole

    # Removed: from app.models.user import User
__all__ = ["User"]


class User(OrganizationMixin, BaseModel):
    """Application user."""

    __tablename__ = "users"

    created_tickets: Mapped[list[Ticket]] = relationship(
        "Ticket",
        foreign_keys="Ticket.created_by",
        back_populates="creator",
    )

    assigned_tickets: Mapped[list[Ticket]] = relationship(
        "Ticket",
        foreign_keys="Ticket.assigned_to",
        back_populates="assignee",
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default="true",
        nullable=False,
    )

    is_superuser: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false",
        nullable=False,
    )

    organization: Mapped[Organization] = relationship(
        "Organization",
        back_populates="users",
        lazy="select",
    )
    user_roles: Mapped[list[UserRole]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


# Re-export User for type checking.
__all__ = ["User"]

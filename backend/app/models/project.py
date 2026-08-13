"""Project ORM model."""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.mixins import OrganizationMixin
from app.projects.constants import DEFAULT_PRIORITY, DEFAULT_STATUS

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User

__all__ = ["Project"]


class Project(OrganizationMixin, BaseModel):
    """Project entity."""

    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        unique=True,
    )

    key: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        unique=True,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    owner_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default=DEFAULT_STATUS,
        server_default=DEFAULT_STATUS,
        nullable=False,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        default=DEFAULT_PRIORITY,
        server_default=DEFAULT_PRIORITY,
        nullable=False,
        index=True,
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
    )

    organization: Mapped[Organization] = relationship(
        "Organization",
        lazy="select",
    )

    owner: Mapped[User] = relationship(
        "User",
        lazy="select",
    )

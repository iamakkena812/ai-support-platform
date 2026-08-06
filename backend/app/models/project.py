"""Project ORM model."""

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.mixins import OrganizationMixin

if TYPE_CHECKING:
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

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        server_default="true",
    )

    owner: Mapped[User] = relationship(
        "User",
        lazy="select",
    )

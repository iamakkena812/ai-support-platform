"""Role ORM model."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.mixins import OrganizationMixin

if TYPE_CHECKING:
    from app.models.user_role import UserRole

if TYPE_CHECKING:
    from app.models.role_permission import RolePermission


class Role(OrganizationMixin, BaseModel):
    """Application role."""

    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_system: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )

    user_roles: Mapped[list[UserRole]] = relationship(
        back_populates="role",
        cascade="all, delete-orphan",
    )

    role_permissions: Mapped[list[RolePermission]] = relationship(
        back_populates="role",
        cascade="all, delete-orphan",
    )

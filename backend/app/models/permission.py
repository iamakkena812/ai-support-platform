"""Permission ORM model."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.role_permission import RolePermission


class Permission(BaseModel):
    """Application permission."""

    __tablename__ = "permissions"

    __table_args__ = (
        UniqueConstraint(
            "resource",
            "action",
            name="uq_permission_resource_action",
        ),
        Index(
            "ix_permission_resource_action",
            "resource",
            "action",
        ),
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    resource: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    role_permissions: Mapped[list[RolePermission]] = relationship(
        back_populates="permission",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

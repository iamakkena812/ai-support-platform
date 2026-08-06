"""Customer models."""

from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.customers.constants import CustomerStatus, CustomerType
from app.database.base import Base
from app.models.mixins import TimestampMixin


class Customer(TimestampMixin, Base):
    """Customer model."""

    __tablename__ = "customers"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    company_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
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

    customer_type: Mapped[CustomerType] = mapped_column(
        Enum(CustomerType),
        default=CustomerType.BUSINESS,
        nullable=False,
    )

    status: Mapped[CustomerStatus] = mapped_column(
        Enum(CustomerStatus),
        default=CustomerStatus.ACTIVE,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    def soft_delete(self) -> None:
        """Soft delete the customer."""
        self.is_deleted = True
        self.is_active = False

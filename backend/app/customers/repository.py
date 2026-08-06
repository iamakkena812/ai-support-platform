"""Customer repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.customers.models import Customer


class CustomerRepository:
    """Repository for customer persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        customer: Customer,
    ) -> Customer:
        """Create a customer."""
        self._session.add(customer)
        self._session.commit()
        self._session.refresh(customer)

        return customer

    def get(
        self,
        customer_id: UUID,
    ) -> Customer | None:
        """Return a customer by ID."""
        statement = select(Customer).where(
            Customer.id == customer_id,
            Customer.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def get_by_email(
        self,
        email: str,
    ) -> Customer | None:
        """Return a customer by email."""
        statement = select(Customer).where(
            Customer.email == email,
            Customer.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def exists_by_email(
        self,
        email: str,
    ) -> bool:
        """Return whether a customer email already exists."""
        return self.get_by_email(email) is not None

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Customer]:
        """Return a paginated list of customers."""
        statement = (
            select(Customer)
            .where(Customer.is_deleted.is_(False))
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement).all())

    def update(
        self,
        customer: Customer,
    ) -> Customer:
        """Update a customer."""
        self._session.add(customer)
        self._session.commit()
        self._session.refresh(customer)

        return customer

    def delete(
        self,
        customer: Customer,
    ) -> None:
        """Soft delete a customer."""
        customer.soft_delete()

        self._session.add(customer)
        self._session.commit()
        self._session.refresh(customer)

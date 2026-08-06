"""Customer service."""

from __future__ import annotations

from uuid import UUID

from app.customers.exceptions import (
    CustomerAlreadyExistsException,
    CustomerNotFoundException,
)
from app.customers.models import Customer
from app.customers.repository import CustomerRepository
from app.customers.schemas import (
    CreateCustomerRequest,
    UpdateCustomerRequest,
)


class CustomerService:
    """Service for customer operations."""

    def __init__(
        self,
        repository: CustomerRepository,
    ) -> None:
        """Initialize service."""
        self._repository = repository

    def create_customer(
        self,
        *,
        organization_id: UUID,
        request: CreateCustomerRequest,
    ) -> Customer:
        """Create a new customer."""
        if self._repository.exists_by_email(request.email):
            raise CustomerAlreadyExistsException()

        customer = Customer(
            organization_id=organization_id,
            name=request.name,
            company_name=request.company_name,
            email=request.email,
            phone=request.phone,
            website=request.website,
            address=request.address,
            city=request.city,
            state=request.state,
            country=request.country,
            postal_code=request.postal_code,
            customer_type=request.customer_type,
            status=request.status,
            is_active=True,
        )

        return self._repository.create(customer)

    def get_customer(
        self,
        customer_id: UUID,
    ) -> Customer:
        """Return a customer by ID."""
        customer = self._repository.get(customer_id)

        if customer is None:
            raise CustomerNotFoundException()

        return customer

    def list_customers(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Customer]:
        """Return customers."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def update_customer(
        self,
        customer_id: UUID,
        request: UpdateCustomerRequest,
    ) -> Customer:
        """Update a customer."""
        customer = self.get_customer(customer_id)

        update_data = request.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if (
            "email" in update_data
            and update_data["email"] != customer.email
            and self._repository.exists_by_email(update_data["email"])
        ):
            raise CustomerAlreadyExistsException()

        for field, value in update_data.items():
            setattr(customer, field, value)

        return self._repository.update(customer)

    def delete_customer(
        self,
        customer_id: UUID,
    ) -> None:
        """Delete a customer."""
        customer = self.get_customer(customer_id)
        self._repository.delete(customer)

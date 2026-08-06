"""Customer service tests."""

from __future__ import annotations

from uuid import uuid4

from pytest import raises
from sqlalchemy.orm import Session

from app.customers.constants import (
    CustomerStatus,
    CustomerType,
)
from app.customers.exceptions import (
    CustomerAlreadyExistsException,
    CustomerNotFoundException,
)
from app.customers.repository import CustomerRepository
from app.customers.schemas import (
    CreateCustomerRequest,
    UpdateCustomerRequest,
)
from app.customers.service import CustomerService
from app.models.organization import Organization


def build_request(
    *,
    name: str = "John Doe",
    email: str = "john@example.com",
) -> CreateCustomerRequest:
    """Build a customer request."""
    return CreateCustomerRequest(
        name=name,
        company_name="OpenAI",
        email=email,
        phone="9876543210",
        website="https://example.com",
        address="Hyderabad",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500001",
        customer_type=CustomerType.BUSINESS,
        status=CustomerStatus.ACTIVE,
    )


def test_create_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Create a customer."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    customer = service.create_customer(
        organization_id=organization.id,
        request=build_request(),
    )

    assert customer.id is not None
    assert customer.email == "john@example.com"


def test_duplicate_email(
    db_session: Session,
    organization: Organization,
) -> None:
    """Raise duplicate email exception."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    request = build_request()

    service.create_customer(
        organization_id=organization.id,
        request=request,
    )

    with raises(CustomerAlreadyExistsException):
        service.create_customer(
            organization_id=organization.id,
            request=request,
        )


def test_get_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return a customer."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    customer = service.create_customer(
        organization_id=organization.id,
        request=build_request(),
    )

    result = service.get_customer(customer.id)

    assert result.id == customer.id


def test_get_missing_customer(
    db_session: Session,
) -> None:
    """Raise customer not found."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    with raises(CustomerNotFoundException):
        service.get_customer(uuid4())


def test_list_customers(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return customer list."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    service.create_customer(
        organization_id=organization.id,
        request=build_request(),
    )

    customers = service.list_customers()

    assert len(customers) >= 1


def test_update_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Update a customer."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    customer = service.create_customer(
        organization_id=organization.id,
        request=build_request(),
    )

    updated = service.update_customer(
        customer.id,
        UpdateCustomerRequest(
            name="Updated Customer",
            status=CustomerStatus.INACTIVE,
        ),
    )

    assert updated.name == "Updated Customer"
    assert updated.status == CustomerStatus.INACTIVE


def test_delete_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Delete a customer."""
    repository = CustomerRepository(db_session)
    service = CustomerService(repository)

    customer = service.create_customer(
        organization_id=organization.id,
        request=build_request(),
    )

    service.delete_customer(customer.id)

    deleted = repository.get(customer.id)

    assert deleted is None

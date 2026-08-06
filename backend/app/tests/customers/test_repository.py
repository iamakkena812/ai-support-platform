"""Customer repository tests."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.customers.constants import (
    CustomerStatus,
    CustomerType,
)
from app.customers.models import Customer
from app.customers.repository import CustomerRepository
from app.models.organization import Organization


def build_customer(
    organization: Organization,
    *,
    name: str = "John Doe",
    email: str = "john@example.com",
) -> Customer:
    """Build a customer instance."""
    return Customer(
        organization_id=organization.id,
        name=name,
        company_name="OpenAI",
        email=email,
        phone="9876543210",
        website="https://example.com",
        address="123 Main Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500001",
        customer_type=CustomerType.BUSINESS,
        status=CustomerStatus.ACTIVE,
        is_active=True,
    )


def test_create_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Create a customer."""
    repository = CustomerRepository(db_session)

    customer = build_customer(organization)

    result = repository.create(customer)

    assert result.id is not None
    assert result.name == "John Doe"


def test_get_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Get a customer."""
    repository = CustomerRepository(db_session)

    customer = repository.create(build_customer(organization))

    result = repository.get(customer.id)

    assert result is not None
    assert result.id == customer.id


def test_get_missing_customer(
    db_session: Session,
) -> None:
    """Return None for missing customer."""
    repository = CustomerRepository(db_session)

    result = repository.get_by_email("missing@example.com")

    assert result is None


def test_get_by_email(
    db_session: Session,
    organization: Organization,
) -> None:
    """Get customer by email."""
    repository = CustomerRepository(db_session)

    customer = repository.create(build_customer(organization))

    result = repository.get_by_email(customer.email)

    assert result is not None
    assert result.email == customer.email


def test_exists_by_email(
    db_session: Session,
    organization: Organization,
) -> None:
    """Check email existence."""
    repository = CustomerRepository(db_session)

    customer = repository.create(build_customer(organization))

    assert repository.exists_by_email(customer.email)
    assert not repository.exists_by_email("unknown@example.com")


def test_list_customers(
    db_session: Session,
    organization: Organization,
) -> None:
    """List customers."""
    repository = CustomerRepository(db_session)

    repository.create(build_customer(organization))

    customers = repository.list()

    assert len(customers) >= 1


def test_update_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Update customer."""
    repository = CustomerRepository(db_session)

    customer = repository.create(build_customer(organization))

    customer.name = "Updated Customer"

    updated = repository.update(customer)

    assert updated.name == "Updated Customer"


def test_delete_customer(
    db_session: Session,
    organization: Organization,
) -> None:
    """Soft delete customer."""
    repository = CustomerRepository(db_session)

    customer = repository.create(build_customer(organization))

    repository.delete(customer)

    assert customer.is_deleted is True
    assert customer.is_active is False


def test_customer_pagination(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return paginated customers."""
    repository = CustomerRepository(db_session)

    for index in range(5):
        repository.create(
            build_customer(
                organization,
                name=f"Customer {index}",
                email=f"customer{index}@example.com",
            )
        )

    customers = repository.list(
        offset=0,
        limit=3,
    )

    assert len(customers) == 3

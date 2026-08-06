"""Customer router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.customers.dependencies import CustomerServiceDependency
from app.customers.schemas import (
    CreateCustomerRequest,
    CustomerResponse,
    UpdateCustomerRequest,
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    request: CreateCustomerRequest,
    service: CustomerServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> CustomerResponse:
    """Create a customer."""
    customer = service.create_customer(
        organization_id=current_user.organization_id,
        request=request,
    )

    return CustomerResponse.model_validate(customer)


@router.get(
    "",
    response_model=list[CustomerResponse],
)
def list_customers(
    service: CustomerServiceDependency,
    _: CurrentActiveUserDependency,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[CustomerResponse]:
    """Return customers."""
    customers = service.list_customers(
        offset=offset,
        limit=limit,
    )

    return [CustomerResponse.model_validate(customer) for customer in customers]


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: UUID,
    service: CustomerServiceDependency,
    _: CurrentActiveUserDependency,
) -> CustomerResponse:
    """Return a customer."""
    customer = service.get_customer(customer_id)

    return CustomerResponse.model_validate(customer)


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer(
    customer_id: UUID,
    request: UpdateCustomerRequest,
    service: CustomerServiceDependency,
    _: CurrentActiveUserDependency,
) -> CustomerResponse:
    """Update a customer."""
    customer = service.update_customer(
        customer_id,
        request,
    )

    return CustomerResponse.model_validate(customer)


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer(
    customer_id: UUID,
    service: CustomerServiceDependency,
    _: CurrentActiveUserDependency,
) -> None:
    """Delete a customer."""
    service.delete_customer(customer_id)

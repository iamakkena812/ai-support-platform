"""Customer router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.customers.dependencies import CustomerServiceDependency
from app.customers.schemas import (
    CreateCustomerRequest,
    CustomerListResponse,
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
    response_model=CustomerListResponse,
)
def list_customers(
    service: CustomerServiceDependency,
    _: CurrentActiveUserDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=500, alias="pageSize"),
) -> CustomerListResponse:
    """Return a paginated list of customers."""
    offset = (page - 1) * page_size

    customers = service.list_customers(
        offset=offset,
        limit=page_size,
    )
    total = service.count_customers()

    return CustomerListResponse(
        items=[CustomerResponse.model_validate(customer) for customer in customers],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


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


@router.patch(
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

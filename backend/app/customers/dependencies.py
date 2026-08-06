"""Customer dependency providers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.customers.repository import CustomerRepository
from app.customers.service import CustomerService
from app.database import get_db

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_customer_repository(
    db: DatabaseSession,
) -> CustomerRepository:
    """Return a customer repository."""
    return CustomerRepository(db)


CustomerRepositoryDependency = Annotated[
    CustomerRepository,
    Depends(get_customer_repository),
]


def get_customer_service(
    repository: CustomerRepositoryDependency,
) -> CustomerService:
    """Return a customer service."""
    return CustomerService(repository)


CustomerServiceDependency = Annotated[
    CustomerService,
    Depends(get_customer_service),
]

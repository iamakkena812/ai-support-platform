"""Customer schemas."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.customers.constants import (
    MAX_ADDRESS_LENGTH,
    MAX_CITY_LENGTH,
    MAX_COMPANY_NAME_LENGTH,
    MAX_COUNTRY_LENGTH,
    MAX_CUSTOMER_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_PHONE_LENGTH,
    MAX_POSTAL_CODE_LENGTH,
    MAX_STATE_LENGTH,
    MAX_WEBSITE_LENGTH,
    CustomerStatus,
    CustomerType,
)


class CreateCustomerRequest(BaseModel):
    """Request schema for creating a customer."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=MAX_CUSTOMER_NAME_LENGTH,
    )
    company_name: str | None = Field(
        default=None,
        max_length=MAX_COMPANY_NAME_LENGTH,
    )
    email: EmailStr = Field(
        ...,
        max_length=MAX_EMAIL_LENGTH,
    )
    phone: str | None = Field(
        default=None,
        max_length=MAX_PHONE_LENGTH,
    )
    website: str | None = Field(
        default=None,
        max_length=MAX_WEBSITE_LENGTH,
    )
    address: str | None = Field(
        default=None,
        max_length=MAX_ADDRESS_LENGTH,
    )
    city: str | None = Field(
        default=None,
        max_length=MAX_CITY_LENGTH,
    )
    state: str | None = Field(
        default=None,
        max_length=MAX_STATE_LENGTH,
    )
    country: str | None = Field(
        default=None,
        max_length=MAX_COUNTRY_LENGTH,
    )
    postal_code: str | None = Field(
        default=None,
        max_length=MAX_POSTAL_CODE_LENGTH,
    )
    customer_type: CustomerType = CustomerType.BUSINESS
    status: CustomerStatus = CustomerStatus.ACTIVE


class UpdateCustomerRequest(BaseModel):
    """Request schema for updating a customer."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=MAX_CUSTOMER_NAME_LENGTH,
    )
    company_name: str | None = Field(
        default=None,
        max_length=MAX_COMPANY_NAME_LENGTH,
    )
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        max_length=MAX_PHONE_LENGTH,
    )
    website: str | None = Field(
        default=None,
        max_length=MAX_WEBSITE_LENGTH,
    )
    address: str | None = Field(
        default=None,
        max_length=MAX_ADDRESS_LENGTH,
    )
    city: str | None = Field(
        default=None,
        max_length=MAX_CITY_LENGTH,
    )
    state: str | None = Field(
        default=None,
        max_length=MAX_STATE_LENGTH,
    )
    country: str | None = Field(
        default=None,
        max_length=MAX_COUNTRY_LENGTH,
    )
    postal_code: str | None = Field(
        default=None,
        max_length=MAX_POSTAL_CODE_LENGTH,
    )
    customer_type: CustomerType | None = None
    status: CustomerStatus | None = None


class CustomerResponse(BaseModel):
    """Customer response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID

    name: str
    company_name: str | None

    email: EmailStr
    phone: str | None
    website: str | None

    address: str | None
    city: str | None
    state: str | None
    country: str | None
    postal_code: str | None

    customer_type: CustomerType
    status: CustomerStatus

    is_active: bool
    is_deleted: bool

    created_at: datetime
    updated_at: datetime


class CustomerListResponse(BaseModel):
    """Paginated customer list response."""

    items: list[CustomerResponse]
    total: int

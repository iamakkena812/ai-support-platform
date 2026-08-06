"""Organization API schemas."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class CreateOrganizationRequest(BaseModel):
    """Request model for creating an organization."""

    name: str = Field(
        min_length=2,
        max_length=255,
    )

    code: str = Field(
        min_length=2,
        max_length=50,
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        max_length=25,
    )

    website: HttpUrl | None = None

    logo_url: HttpUrl | None = None

    address: str | None = Field(
        default=None,
        max_length=500,
    )

    city: str | None = Field(
        default=None,
        max_length=100,
    )

    state: str | None = Field(
        default=None,
        max_length=100,
    )

    country: str | None = Field(
        default=None,
        max_length=100,
    )

    postal_code: str | None = Field(
        default=None,
        max_length=20,
    )

    timezone: str = Field(
        default="UTC",
        max_length=100,
    )


class UpdateOrganizationRequest(BaseModel):
    """Request model for updating an organization."""

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    code: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        max_length=25,
    )

    website: HttpUrl | None = None

    logo_url: HttpUrl | None = None

    address: str | None = Field(
        default=None,
        max_length=500,
    )

    city: str | None = Field(
        default=None,
        max_length=100,
    )

    state: str | None = Field(
        default=None,
        max_length=100,
    )

    country: str | None = Field(
        default=None,
        max_length=100,
    )

    postal_code: str | None = Field(
        default=None,
        max_length=20,
    )

    timezone: str | None = Field(
        default=None,
        max_length=100,
    )

    is_active: bool | None = None


class OrganizationResponse(BaseModel):
    """Organization response model."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    name: str
    code: str
    email: EmailStr | None
    phone: str | None
    website: HttpUrl | None
    logo_url: HttpUrl | None
    address: str | None
    city: str | None
    state: str | None
    country: str | None
    postal_code: str | None
    timezone: str
    is_active: bool


class OrganizationListResponse(BaseModel):
    """Organization list response."""

    organizations: list[OrganizationResponse]

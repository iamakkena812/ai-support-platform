"""User API schemas."""

from __future__ import annotations

from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class CreateUserRequest(BaseModel):
    """Request model for creating a user."""

    email: EmailStr

    username: str = Field(
        min_length=3,
        max_length=100,
    )

    full_name: str = Field(
        min_length=2,
        max_length=255,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    organization_id: UUID

    is_active: bool = True

    is_superuser: bool = False


class UpdateUserRequest(BaseModel):
    """Request model for updating a user."""

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    email: EmailStr | None = None

    is_active: bool | None = None

    is_superuser: bool | None = None


class UserResponse(BaseModel):
    """User response model."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    organization_id: UUID

    email: EmailStr

    username: str

    full_name: str

    is_active: bool

    is_superuser: bool


class UserListResponse(BaseModel):
    """User list response."""

    users: list[UserResponse]

    total: int

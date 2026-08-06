"""Authentication schemas."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class LoginRequest(BaseModel):
    """Login request."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"

    model_config = ConfigDict(
        from_attributes=True,
    )


class RegisterRequest(BaseModel):
    """User registration request."""

    email: EmailStr
    username: str
    full_name: str | None = None
    password: str
    organization_id: UUID


class UserResponse(BaseModel):
    """User response."""

    id: UUID
    email: EmailStr
    username: str
    full_name: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )

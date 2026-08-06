"""Authentication domain models."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(slots=True, frozen=True)
class TokenPayload:
    """JWT token payload."""

    subject: UUID
    issued_at: datetime
    expires_at: datetime


@dataclass(slots=True, frozen=True)
class AuthenticatedUser:
    """Authenticated user context."""

    user_id: UUID
    email: str
    username: str
    is_superuser: bool
    is_active: bool

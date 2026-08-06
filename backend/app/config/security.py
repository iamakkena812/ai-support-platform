"""Security utilities for authentication and authorization."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt import InvalidTokenError
from pwdlib import PasswordHash

from app.config.settings import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a plain-text password.

    Args:
        password: Plain-text password.

    Returns:
        Secure password hash.
    """
    return password_hash.hash(password)


def verify_password(password: str, password_hash_value: str) -> bool:
    """Verify a plain-text password against its hash.

    Args:
        password: Plain-text password.
        password_hash_value: Stored password hash.

    Returns:
        True if the password matches; otherwise False.
    """
    return password_hash.verify(password, password_hash_value)


def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
    additional_claims: dict[str, Any] | None = None,
) -> str:
    """Create a signed JWT access token.

    Args:
        subject: Unique subject identifier (typically the user ID).
        expires_delta: Optional custom expiration time.
        additional_claims: Optional additional JWT claims.

    Returns:
        Encoded JWT token.
    """
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(UTC),
    }

    if additional_claims:
        payload.update(additional_claims)

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token.

    Args:
        token: JWT token.

    Returns:
        Decoded JWT payload.

    Raises:
        InvalidTokenError: If the token is invalid or expired.
    """
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except InvalidTokenError as exc:
        raise InvalidTokenError("Invalid or expired access token.") from exc

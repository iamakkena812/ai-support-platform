"""JWT authentication utilities."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.auth.exceptions import InvalidTokenError
from app.config.settings import settings


def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT access token.

    Args:
        subject: Subject identifier.
        expires_delta: Optional token lifetime.

    Returns:
        Encoded JWT access token.
    """
    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        )

    expire = datetime.now(UTC) + expires_delta

    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict[str, Any]:
    """Decode and validate an access token.

    Args:
        token: Encoded JWT access token.

    Returns:
        Decoded JWT payload.

    Raises:
        InvalidTokenError: If the JWT is malformed, expired, or invalid.
    """
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise InvalidTokenError(
            "Invalid access token.",
        ) from exc
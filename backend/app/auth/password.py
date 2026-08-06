"""Password hashing utilities."""

from __future__ import annotations

from pwdlib import PasswordHash

_password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a password."""
    return _password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Verify a password."""
    return _password_hash.verify(
        plain_password,
        hashed_password,
    )

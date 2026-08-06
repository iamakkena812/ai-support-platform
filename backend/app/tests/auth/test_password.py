"""Tests for password utilities."""

from __future__ import annotations

from app.auth.password import (
    hash_password,
    verify_password,
)


def test_hash_password_returns_different_value() -> None:
    """Password should not equal its hash."""
    password = "Password@123"

    hashed = hash_password(password)

    assert hashed != password


def test_verify_password_returns_true() -> None:
    """Correct password should verify."""
    password = "Password@123"

    hashed = hash_password(password)

    assert verify_password(password, hashed)


def test_verify_password_returns_false() -> None:
    """Incorrect password should fail."""
    hashed = hash_password("Password@123")

    assert not verify_password(
        "WrongPassword",
        hashed,
    )

"""Tests for JWT utilities."""

from __future__ import annotations

import pytest
from jwt import InvalidTokenError

from app.auth.jwt import (
    create_access_token,
    decode_access_token,
)


def test_create_access_token_returns_string() -> None:
    """Access token should be a string."""
    token = create_access_token("user123")

    assert isinstance(token, str)
    assert token


def test_decode_access_token() -> None:
    """Token should decode correctly."""
    token = create_access_token("user123")

    payload = decode_access_token(token)

    assert payload["sub"] == "user123"


def test_invalid_token() -> None:
    """Invalid JWT should raise."""
    with pytest.raises(InvalidTokenError):
        decode_access_token("invalid-token")

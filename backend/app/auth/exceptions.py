"""Exceptions raised during authentication."""

from __future__ import annotations


class InvalidTokenError(Exception):
    """Raised when an authentication token is invalid."""
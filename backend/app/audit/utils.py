"""Utility functions for the audit module."""

from __future__ import annotations

from typing import Any


def build_changeset(
    old: dict[str, Any] | None,
    new: dict[str, Any] | None,
) -> tuple[dict[str, Any] | None, dict[str, Any] | None]:
    """Return normalized audit change sets."""
    return (
        old or {},
        new or {},
    )


def has_changes(
    old: dict[str, Any] | None,
    new: dict[str, Any] | None,
) -> bool:
    """Return whether the values differ."""
    return (old or {}) != (new or {})

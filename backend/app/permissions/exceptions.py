"""Exceptions raised by the permission management module."""

from __future__ import annotations


class PermissionError(Exception):
    """Base exception for permission management errors."""


class PermissionNotFoundError(PermissionError):
    """Raised when a permission cannot be found."""


class PermissionAlreadyExistsError(PermissionError):
    """Raised when a permission already exists."""


class PermissionInUseError(PermissionError):
    """Raised when a permission cannot be deleted because it is in use."""
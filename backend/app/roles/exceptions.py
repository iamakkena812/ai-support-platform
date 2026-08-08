"""Exceptions for role management."""

from __future__ import annotations


class RoleError(Exception):
    """Base exception for role management."""


class RoleNotFoundError(RoleError):
    """Raised when a requested role does not exist."""


class RoleAlreadyExistsError(RoleError):
    """Raised when a role already exists."""


class RoleInUseError(RoleError):
    """Raised when a role cannot be modified or deleted because it is in use."""


class SystemRoleError(RoleError):
    """Raised when an operation is not allowed on a system role."""
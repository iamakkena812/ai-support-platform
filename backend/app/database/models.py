"""Register all SQLAlchemy ORM models."""

from __future__ import annotations

from app.models.organization import Organization
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.ticket import Ticket
from app.models.user import User
from app.models.user_role import UserRole

__all__ = [
    "Organization",
    "Permission",
    "Role",
    "RolePermission",
    "Ticket",
    "User",
    "UserRole",
]

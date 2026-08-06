"""RBAC permission constants."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class PermissionDefinition:
    """Represents a permission."""

    resource: str
    action: str


#
# User Permissions
#

USER_CREATE = PermissionDefinition(
    resource="user",
    action="create",
)

USER_READ = PermissionDefinition(
    resource="user",
    action="read",
)

USER_UPDATE = PermissionDefinition(
    resource="user",
    action="update",
)

USER_DELETE = PermissionDefinition(
    resource="user",
    action="delete",
)


#
# Role Permissions
#

ROLE_CREATE = PermissionDefinition(
    resource="role",
    action="create",
)

ROLE_READ = PermissionDefinition(
    resource="role",
    action="read",
)

ROLE_UPDATE = PermissionDefinition(
    resource="role",
    action="update",
)

ROLE_DELETE = PermissionDefinition(
    resource="role",
    action="delete",
)

ROLE_ASSIGN = PermissionDefinition(
    resource="role",
    action="assign",
)


#
# Permission Management
#

PERMISSION_CREATE = PermissionDefinition(
    resource="permission",
    action="create",
)

PERMISSION_READ = PermissionDefinition(
    resource="permission",
    action="read",
)

PERMISSION_UPDATE = PermissionDefinition(
    resource="permission",
    action="update",
)

PERMISSION_DELETE = PermissionDefinition(
    resource="permission",
    action="delete",
)


#
# Organization Permissions
#

ORGANIZATION_CREATE = PermissionDefinition(
    resource="organization",
    action="create",
)

ORGANIZATION_READ = PermissionDefinition(
    resource="organization",
    action="read",
)

ORGANIZATION_UPDATE = PermissionDefinition(
    resource="organization",
    action="update",
)

ORGANIZATION_DELETE = PermissionDefinition(
    resource="organization",
    action="delete",
)


#
# Ticket Permissions
#

TICKET_CREATE = PermissionDefinition(
    resource="ticket",
    action="create",
)

TICKET_READ = PermissionDefinition(
    resource="ticket",
    action="read",
)

TICKET_UPDATE = PermissionDefinition(
    resource="ticket",
    action="update",
)

TICKET_DELETE = PermissionDefinition(
    resource="ticket",
    action="delete",
)

TICKET_ASSIGN = PermissionDefinition(
    resource="ticket",
    action="assign",
)

TICKET_CLOSE = PermissionDefinition(
    resource="ticket",
    action="close",
)


#
# Knowledge Base Permissions
#

KNOWLEDGE_CREATE = PermissionDefinition(
    resource="knowledge",
    action="create",
)

KNOWLEDGE_READ = PermissionDefinition(
    resource="knowledge",
    action="read",
)

KNOWLEDGE_UPDATE = PermissionDefinition(
    resource="knowledge",
    action="update",
)

KNOWLEDGE_DELETE = PermissionDefinition(
    resource="knowledge",
    action="delete",
)


#
# AI Assistant Permissions
#

AI_CHAT = PermissionDefinition(
    resource="ai",
    action="chat",
)

AI_GENERATE = PermissionDefinition(
    resource="ai",
    action="generate",
)

AI_EVALUATE = PermissionDefinition(
    resource="ai",
    action="evaluate",
)

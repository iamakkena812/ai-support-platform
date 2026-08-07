"""Register all SQLAlchemy ORM models."""

from __future__ import annotations

from app.attachments.models import Attachment

# Feature Models
from app.comments.models import Comment

# Core Models
from app.models.organization import Organization
from app.models.permission import Permission
from app.models.project import Project
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.team import Team
from app.models.ticket import Ticket
from app.models.user import User
from app.models.user_role import UserRole
from app.notifications.models import Notification

# SLA Models
from app.sla.models import SLAEvent, SLAPolicy

# Workflow Models
from app.workflows.models import (
    Workflow,
    WorkflowAction,
    WorkflowCondition,
)

__all__ = [
    # Core
    "Organization",
    "Permission",
    "Project",
    "Role",
    "RolePermission",
    "Team",
    "Ticket",
    "User",
    "UserRole",
    # Features
    "Comment",
    "Attachment",
    "Notification",
    # SLA
    "SLAPolicy",
    "SLAEvent",
    # Workflows
    "Workflow",
    "WorkflowAction",
    "WorkflowCondition",
]

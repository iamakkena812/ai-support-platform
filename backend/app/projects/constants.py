"""Project module constants."""

from __future__ import annotations

from enum import StrEnum

PROJECT_NAME_MIN_LENGTH = 3
PROJECT_NAME_MAX_LENGTH = 100

PROJECT_DESCRIPTION_MAX_LENGTH = 1000

PROJECT_KEY_MIN_LENGTH = 2
PROJECT_KEY_MAX_LENGTH = 10

DEFAULT_PROJECT_LIMIT = 100
DEFAULT_PROJECT_OFFSET = 0


class ProjectStatus(StrEnum):
    """Supported project statuses."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"
    COMPLETED = "completed"


class ProjectPriority(StrEnum):
    """Supported project priorities."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


DEFAULT_STATUS = ProjectStatus.ACTIVE
DEFAULT_PRIORITY = ProjectPriority.MEDIUM

PROJECT_NOT_FOUND = "Project not found."
PROJECT_ALREADY_EXISTS = "Project already exists."
PROJECT_NAME_ALREADY_EXISTS = "Project name already exists."
PROJECT_KEY_ALREADY_EXISTS = "Project key already exists."
PROJECT_ARCHIVED = "Project is archived."
PROJECT_ACCESS_DENIED = "Access denied to project."

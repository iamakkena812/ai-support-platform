"""Project module exceptions."""

from __future__ import annotations


class ProjectError(Exception):
    """Base exception for the Projects module."""


class ProjectNotFoundError(ProjectError):
    """Raised when a project cannot be found."""


class ProjectAlreadyExistsError(ProjectError):
    """Raised when a project already exists."""


class ProjectNameAlreadyExistsError(ProjectAlreadyExistsError):
    """Raised when a project name already exists."""


class ProjectKeyAlreadyExistsError(ProjectAlreadyExistsError):
    """Raised when a project key already exists."""


class ProjectArchivedError(ProjectError):
    """Raised when an operation is attempted on an archived project."""


class ProjectAccessDeniedError(ProjectError):
    """Raised when access to a project is denied."""


class InvalidProjectStateError(ProjectError):
    """Raised when a project is in an invalid state."""

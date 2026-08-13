"""Project schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING
from uuid import UUID

from pydantic import ConfigDict, Field

from app.core.schemas import CamelModel
from app.projects.constants import (
    PROJECT_DESCRIPTION_MAX_LENGTH,
    PROJECT_NAME_MAX_LENGTH,
    PROJECT_NAME_MIN_LENGTH,
    ProjectPriority,
    ProjectStatus,
)

if TYPE_CHECKING:
    from app.models.project import Project


class ProjectCreateRequest(CamelModel):
    """Request model for creating a project.

    ``organization_id`` and ``owner_id`` are intentionally absent: the
    organization is derived from the authenticated user (matching the
    customers/tickets modules) and the creator becomes the owner. The
    project ``key`` is generated server-side since the UI never collects
    one.
    """

    name: str = Field(
        min_length=PROJECT_NAME_MIN_LENGTH,
        max_length=PROJECT_NAME_MAX_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=PROJECT_DESCRIPTION_MAX_LENGTH,
    )
    priority: ProjectPriority = ProjectPriority.MEDIUM
    team_ids: list[UUID] | None = None
    member_ids: list[UUID] | None = None
    start_date: date | None = None
    end_date: date | None = None


class ProjectUpdateRequest(CamelModel):
    """Request model for updating a project."""

    name: str | None = Field(
        default=None,
        min_length=PROJECT_NAME_MIN_LENGTH,
        max_length=PROJECT_NAME_MAX_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=PROJECT_DESCRIPTION_MAX_LENGTH,
    )
    status: ProjectStatus | None = None
    priority: ProjectPriority | None = None
    team_ids: list[UUID] | None = None
    member_ids: list[UUID] | None = None
    start_date: date | None = None
    end_date: date | None = None


class ProjectOrganizationRef(CamelModel):
    """Minimal organization reference."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str


class ProjectUserRef(CamelModel):
    """Minimal user reference."""

    id: UUID
    name: str
    email: str


class ProjectTeamRef(CamelModel):
    """Minimal team reference."""

    id: UUID
    name: str


class ProjectResponse(CamelModel):
    """Project response model."""

    id: UUID
    name: str
    key: str
    description: str | None
    status: ProjectStatus
    priority: ProjectPriority
    organization: ProjectOrganizationRef | None
    teams: list[ProjectTeamRef]
    members: list[ProjectUserRef]
    owner: ProjectUserRef | None
    start_date: date | None
    end_date: date | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_project(cls, project: Project) -> ProjectResponse:
        """Build a response from a ``Project`` ORM instance.

        Built explicitly (rather than via ``model_validate``) because
        team/member assignment is not backed by persistence yet -- see
        Phase 9 (Teams) -- and the owner's display name comes from
        ``User.full_name`` rather than a ``name`` attribute.
        """
        return cls(
            id=project.id,
            name=project.name,
            key=project.key,
            description=project.description,
            status=ProjectStatus(project.status),
            priority=ProjectPriority(project.priority),
            organization=(
                ProjectOrganizationRef.model_validate(project.organization)
                if project.organization is not None
                else None
            ),
            teams=[],
            members=[],
            owner=(
                ProjectUserRef(
                    id=project.owner.id,
                    name=project.owner.full_name,
                    email=project.owner.email,
                )
                if project.owner is not None
                else None
            ),
            start_date=project.start_date,
            end_date=project.end_date,
            created_at=project.created_at,
            updated_at=project.updated_at,
        )


class ProjectListResponse(CamelModel):
    """Paginated project response."""

    items: list[ProjectResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ProjectDeleteResponse(CamelModel):
    """Project delete response."""

    message: str


class ProjectStatisticsResponse(CamelModel):
    """Project statistics response."""

    total: int
    active: int
    completed: int
    archived: int

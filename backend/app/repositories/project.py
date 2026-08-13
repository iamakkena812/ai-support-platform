"""Project repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.projects.constants import ProjectPriority, ProjectStatus
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    """Repository for project entities."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the project repository.

        Args:
            session: Active database session.
        """
        super().__init__(
            session=session,
            model=Project,
        )

    def get_by_name(
        self,
        name: str,
    ) -> Project | None:
        """Return a project by name."""
        statement = select(Project).where(
            Project.name == name,
            Project.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_by_key(
        self,
        key: str,
    ) -> Project | None:
        """Return a project by key."""
        statement = select(Project).where(
            Project.key == key,
            Project.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def exists_by_name(
        self,
        name: str,
    ) -> bool:
        """Return whether a project exists with the given name.

        Deliberately ignores ``is_deleted``: ``Project.name`` carries a
        database-level UNIQUE constraint that is not scoped to active
        rows, so a soft-deleted project's name is still unavailable.
        This predicts that constraint before insert/update so callers
        get a clean 409 Conflict instead of an unhandled IntegrityError.
        """
        statement = select(Project.id).where(Project.name == name)
        return self.session.execute(statement).first() is not None

    def exists_by_key(
        self,
        key: str,
    ) -> bool:
        """Return whether a project exists with the given key.

        Deliberately ignores ``is_deleted``: ``Project.key`` carries a
        database-level UNIQUE constraint that is not scoped to active
        rows, so a soft-deleted project's key is still unavailable.
        This check exists solely to predict that constraint during key
        generation (see ``ProjectService._generate_unique_key``).
        """
        statement = select(Project.id).where(Project.key == key)
        return self.session.execute(statement).first() is not None

    def create(
        self,
        entity: Project,
    ) -> Project:
        """Create a new project."""
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)

        return entity

    def get(
        self,
        project_id: UUID,
    ) -> Project | None:
        """Return a project by ID."""
        statement = select(Project).where(
            Project.id == project_id,
            Project.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
        search: str | None = None,
        status: ProjectStatus | None = None,
        priority: ProjectPriority | None = None,
    ) -> list[Project]:
        """Return active projects, optionally filtered."""
        statement = select(Project).where(Project.is_deleted.is_(False))

        if search:
            statement = statement.where(
                Project.name.ilike(f"%{search}%"),
            )

        if status is not None:
            statement = statement.where(Project.status == status)

        if priority is not None:
            statement = statement.where(Project.priority == priority)

        statement = statement.offset(offset).limit(limit)

        return list(self.session.scalars(statement).all())

    def update(
        self,
        project: Project,
    ) -> Project:
        """Persist project updates."""
        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)

        return project

    def delete(
        self,
        project: Project,
    ) -> None:
        """Soft-delete a project."""
        project.soft_delete()

        self.session.add(project)
        self.session.commit()

    def count(
        self,
        *,
        search: str | None = None,
        status: ProjectStatus | None = None,
        priority: ProjectPriority | None = None,
    ) -> int:
        """Return the number of active projects, optionally filtered."""
        statement = (
            select(func.count())
            .select_from(Project)
            .where(Project.is_deleted.is_(False))
        )

        if search:
            statement = statement.where(
                Project.name.ilike(f"%{search}%"),
            )

        if status is not None:
            statement = statement.where(Project.status == status)

        if priority is not None:
            statement = statement.where(Project.priority == priority)

        result = self.session.scalar(statement)

        return int(result or 0)

    def count_by_status(
        self,
        status: str,
    ) -> int:
        """Return the number of projects with the given status."""
        statement = (
            select(func.count())
            .select_from(Project)
            .where(
                Project.is_deleted.is_(False),
                Project.status == status,
            )
        )

        result = self.session.scalar(statement)

        return int(result or 0)

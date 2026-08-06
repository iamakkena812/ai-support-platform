"""Project repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.project import Project
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
        """Return whether a project exists with the given name."""
        return self.get_by_name(name) is not None

    def exists_by_key(
        self,
        key: str,
    ) -> bool:
        """Return whether a project exists with the given key."""
        return self.get_by_key(key) is not None

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
    ) -> list[Project]:
        """Return active projects."""
        statement = (
            select(Project)
            .where(Project.is_deleted.is_(False))
            .offset(offset)
            .limit(limit)
        )

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
    ) -> int:
        """Return the number of active projects."""
        statement = (
            select(func.count())
            .select_from(Project)
            .where(Project.is_deleted.is_(False))
        )

        result = self.session.scalar(statement)

        return int(result or 0)

"""Organization repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organization import Organization


class OrganizationRepository:
    """Repository for organization persistence.

    Used by the organizations feature (service, router, dependencies) and by
    app.users. A second, independent OrganizationRepository lives at
    app.repositories.organization (built on BaseRepository) and is used by
    app.teams. Both are live; consolidating them requires a method-by-method
    behavioral diff that hasn't been done, so treat them as intentionally
    separate until that verification happens.
    """

    def __init__(self, session: Session) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        organization: Organization,
    ) -> Organization:
        """Create an organization."""
        self._session.add(organization)
        self._session.commit()
        self._session.refresh(organization)

        return organization

    def get(
        self,
        organization_id: UUID,
    ) -> Organization | None:
        """Return an organization by ID."""
        return self._session.get(
            Organization,
            organization_id,
        )

    def get_by_name(
        self,
        name: str,
    ) -> Organization | None:
        """Return organization by name."""
        statement = select(Organization).where(
            Organization.name == name,
            Organization.deleted_at.is_(None),
        )

        return self._session.scalar(statement)

    def get_by_code(
        self,
        code: str,
    ) -> Organization | None:
        """Return organization by code."""
        statement = select(Organization).where(
            Organization.code == code,
            Organization.deleted_at.is_(None),
        )

        return self._session.scalar(statement)

    def exists_by_name(
        self,
        name: str,
    ) -> bool:
        """Return whether an organization name exists."""
        return self.get_by_name(name) is not None

    def exists_by_code(
        self,
        code: str,
    ) -> bool:
        """Return whether an organization code exists."""
        return self.get_by_code(code) is not None

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Organization]:
        """Return organizations."""
        statement = (
            select(Organization)
            .where(
                Organization.deleted_at.is_(None),
            )
            .offset(offset)
            .limit(limit)
            .order_by(Organization.name)
        )

        return list(
            self._session.scalars(statement).all(),
        )

    def update(
        self,
        organization: Organization,
    ) -> Organization:
        """Update an organization."""
        self._session.commit()
        self._session.refresh(organization)

        return organization

    def delete(
        self,
        organization: Organization,
    ) -> None:
        """Soft delete an organization."""
        organization.soft_delete()

        self._session.commit()

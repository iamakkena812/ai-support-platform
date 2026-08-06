"""Organization repository."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.repositories.base import BaseRepository


class OrganizationRepository(BaseRepository[Organization]):
    """Repository for organization entities.

    Used by app.teams. A second, independent OrganizationRepository lives at
    app.organizations.repository (hand-written CRUD, not BaseRepository) and
    is used by app.organizations and app.users. Both are live; consolidating
    them requires a method-by-method behavioral diff that hasn't been done,
    so treat them as intentionally separate until that verification happens.
    """

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            session: Active database session.
        """
        super().__init__(
            session=session,
            model=Organization,
        )

    def get_by_code(
        self,
        code: str,
    ) -> Organization | None:
        """Return an organization by code.

        Args:
            code: Organization code.

        Returns:
            Matching organization if found; otherwise None.
        """
        statement = select(Organization).where(
            Organization.code == code,
            Organization.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_by_name(
        self,
        name: str,
    ) -> Organization | None:
        """Return an organization by name.

        Args:
            name: Organization name.

        Returns:
            Matching organization if found; otherwise None.
        """
        statement = select(Organization).where(
            Organization.name == name,
            Organization.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def exists_by_code(
        self,
        code: str,
    ) -> bool:
        """Return whether an organization code already exists.

        Args:
            code: Organization code.

        Returns:
            True if the organization exists.
        """
        return self.get_by_code(code) is not None

    def exists_by_name(
        self,
        name: str,
    ) -> bool:
        """Return whether an organization name already exists.

        Args:
            name: Organization name.

        Returns:
            True if the organization exists.
        """
        return self.get_by_name(name) is not None

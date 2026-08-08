"""Role management service."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.role import Role
from app.roles.exceptions import (
    RoleAlreadyExistsError,
    RoleInUseError,
    RoleNotFoundError,
)
from app.roles.repository import RoleRepository
from app.roles.schemas import (
    RoleCreate,
    RoleListQuery,
    RoleListResponse,
    RoleResponse,
    RoleStatistics,
    RoleUpdate,
)


class RoleService:
    """Service for role management operations."""

    def __init__(
        self,
        db: Session,
        organization_id: UUID,
        repository: RoleRepository | None = None,
    ) -> None:
        """Initialize the role service.

        Args:
            db: Database session.
            organization_id: Organization identifier.
            repository: Optional role repository.
        """
        self.db = db
        self.organization_id = organization_id
        self.repository = repository or RoleRepository(db)

    def get_by_id(
        self,
        role_id: UUID,
    ) -> RoleResponse:
        """Return a role by identifier.

        Args:
            role_id: Role identifier.

        Returns:
            Role response.

        Raises:
            RoleNotFoundError: If the role does not exist.
        """
        role = self.repository.get_by_id(role_id)

        if role is None:
            raise RoleNotFoundError(
                f"Role '{role_id}' was not found.",
            )

        return RoleResponse.model_validate(role)

    def list(
        self,
        query: RoleListQuery,
    ) -> RoleListResponse:
        """Return paginated roles.

        Args:
            query: Role list query.

        Returns:
            Paginated role response.
        """
        items, total, total_pages = self.repository.list(query)

        return RoleListResponse(
            items=[
                RoleResponse.model_validate(item)
                for item in items
            ],
            total=total,
            page=query.page,
            page_size=query.page_size,
            total_pages=total_pages,
        )

    def create(
        self,
        request: RoleCreate,
    ) -> RoleResponse:
        """Create a role.

        Args:
            request: Role creation request.

        Returns:
            Created role.

        Raises:
            RoleAlreadyExistsError:
                If a role with the same name already exists.
        """
        existing = self.repository.get_by_name(
            request.name,
        )

        if existing is not None:
            raise RoleAlreadyExistsError(
                f"Role '{request.name}' already exists.",
            )

        role = Role(
            organization_id=self.organization_id,
            name=request.name,
            description=request.description,
            is_system=request.is_system,
        )

        try:
            role = self.repository.create(role)
            self.db.commit()
            self.db.refresh(role)
        except IntegrityError as exc:
            self.db.rollback()

            raise RoleAlreadyExistsError(
                f"Role '{request.name}' already exists.",
            ) from exc

        return RoleResponse.model_validate(role)

    def update(
        self,
        role_id: UUID,
        request: RoleUpdate,
    ) -> RoleResponse:
        """Update a role.

        Args:
            role_id: Role identifier.
            request: Role update request.

        Returns:
            Updated role.

        Raises:
            RoleNotFoundError:
                If the role does not exist.
            RoleAlreadyExistsError:
                If the new role name already exists.
            RoleInUseError:
                If a system role is modified.
        """
        role = self.repository.get_by_id(role_id)

        if role is None:
            raise RoleNotFoundError(
                f"Role '{role_id}' was not found.",
            )

        if role.is_system:
            raise RoleInUseError(
                "System roles cannot be modified.",
            )

        update_data = request.model_dump(
            exclude_unset=True,
        )

        if "name" in update_data:
            existing = self.repository.get_by_name(
                update_data["name"],
            )

            if (
                existing is not None
                and existing.id != role.id
            ):
                raise RoleAlreadyExistsError(
                    f"Role '{update_data['name']}' already exists.",
                )

        for field, value in update_data.items():
            setattr(role, field, value)

        try:
            role = self.repository.update(role)
            self.db.commit()
            self.db.refresh(role)
        except IntegrityError as exc:
            self.db.rollback()

            raise RoleAlreadyExistsError(
                "A role with this name already exists.",
            ) from exc

        return RoleResponse.model_validate(role)

    def delete(
        self,
        role_id: UUID,
    ) -> None:
        """Delete a role.

        Args:
            role_id: Role identifier.

        Raises:
            RoleNotFoundError:
                If the role does not exist.
            RoleInUseError:
                If the role is a system role or is assigned.
        """
        role = self.repository.get_by_id(role_id)

        if role is None:
            raise RoleNotFoundError(
                f"Role '{role_id}' was not found.",
            )

        if role.is_system:
            raise RoleInUseError(
                "System roles cannot be deleted.",
            )

        if role.user_roles:
            raise RoleInUseError(
                "Role cannot be deleted because it "
                "is assigned to one or more users.",
            )

        if role.role_permissions:
            raise RoleInUseError(
                "Role cannot be deleted because it "
                "has one or more permissions assigned.",
            )

        try:
            self.repository.delete(role)
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()

            raise RoleInUseError(
                "Role cannot be deleted because it is currently in use.",
            ) from exc

    def statistics(self) -> RoleStatistics:
        """Return role statistics.

        Returns:
            Role statistics.
        """
        total = self.repository.count()
        system = self.repository.count_system()
        assigned = self.repository.count_assigned()

        return RoleStatistics(
            total=total,
            system=system,
            custom=max(total - system, 0),
            assigned=assigned,
            unassigned=max(total - assigned, 0),
        )


__all__ = ["RoleService"]
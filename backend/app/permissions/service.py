"""Permission management service."""

from __future__ import annotations

import builtins
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.permissions.exceptions import (
    PermissionAlreadyExistsError,
    PermissionInUseError,
    PermissionNotFoundError,
)
from app.permissions.repository import PermissionRepository
from app.permissions.schemas import (
    PermissionCreate,
    PermissionListQuery,
    PermissionListResponse,
    PermissionResponse,
    PermissionStatistics,
    PermissionUpdate,
)


class PermissionService:
    """Service for permission management operations."""

    def __init__(
        self,
        db: Session,
        repository: PermissionRepository | None = None,
    ) -> None:
        """Initialize the permission service.

        Args:
            db: Database session.
            repository: Optional permission repository.
        """
        self.db = db
        self.repository = repository or PermissionRepository(db)

    def get_by_id(
        self,
        permission_id: UUID,
    ) -> PermissionResponse:
        """Return a permission by identifier.

        Args:
            permission_id: Permission identifier.

        Returns:
            Permission response.

        Raises:
            PermissionNotFoundError: If the permission does not exist.
        """
        permission = self.repository.get_by_id(permission_id)

        if permission is None:
            raise PermissionNotFoundError(
                f"Permission '{permission_id}' was not found.",
            )

        return PermissionResponse.model_validate(permission)

    def list(
        self,
        query: PermissionListQuery,
    ) -> PermissionListResponse:
        """Return paginated permissions.

        Args:
            query: Permission list query.

        Returns:
            Paginated permission response.
        """
        items, total, total_pages = self.repository.list(query)

        return PermissionListResponse(
            items=[
                PermissionResponse.model_validate(item)
                for item in items
            ],
            total=total,
            page=query.page,
            page_size=query.page_size,
            total_pages=total_pages,
        )

    def create(
        self,
        request: PermissionCreate,
    ) -> PermissionResponse:
        """Create a permission.

        Args:
            request: Permission creation request.

        Returns:
            Created permission.

        Raises:
            PermissionAlreadyExistsError:
                If the resource/action combination already exists.
        """
        existing = self.repository.get_by_resource_action(
            request.resource,
            request.action,
        )

        if existing is not None:
            raise PermissionAlreadyExistsError(
                "A permission with this resource and action "
                "already exists.",
            )

        permission = Permission(
            name=request.name,
            resource=request.resource,
            action=request.action,
            description=request.description,
        )

        try:
            permission = self.repository.create(permission)
            self.db.commit()
            self.db.refresh(permission)
        except IntegrityError as exc:
            self.db.rollback()

            raise PermissionAlreadyExistsError(
                "A permission with this resource and action "
                "already exists.",
            ) from exc

        return PermissionResponse.model_validate(permission)

    def update(
        self,
        permission_id: UUID,
        request: PermissionUpdate,
    ) -> PermissionResponse:
        """Update a permission.

        Args:
            permission_id: Permission identifier.
            request: Permission update request.

        Returns:
            Updated permission.

        Raises:
            PermissionNotFoundError:
                If the permission does not exist.
            PermissionAlreadyExistsError:
                If the new resource/action combination already exists.
        """
        permission = self.repository.get_by_id(permission_id)

        if permission is None:
            raise PermissionNotFoundError(
                f"Permission '{permission_id}' was not found.",
            )

        update_data = request.model_dump(
            exclude_unset=True,
        )

        resource = update_data.get(
            "resource",
            permission.resource,
        )
        action = update_data.get(
            "action",
            permission.action,
        )

        existing = self.repository.get_by_resource_action(
            resource,
            action,
        )

        if (
            existing is not None
            and existing.id != permission.id
        ):
            raise PermissionAlreadyExistsError(
                "A permission with this resource and action "
                "already exists.",
            )

        for field, value in update_data.items():
            setattr(permission, field, value)

        try:
            permission = self.repository.update(permission)
            self.db.commit()
            self.db.refresh(permission)
        except IntegrityError as exc:
            self.db.rollback()

            raise PermissionAlreadyExistsError(
                "A permission with this resource and action "
                "already exists.",
            ) from exc

        return PermissionResponse.model_validate(permission)

    def delete(
        self,
        permission_id: UUID,
    ) -> None:
        """Delete a permission.

        Args:
            permission_id: Permission identifier.

        Raises:
            PermissionNotFoundError:
                If the permission does not exist.
            PermissionInUseError:
                If the permission is assigned to a role.
        """
        permission = self.repository.get_by_id(permission_id)

        if permission is None:
            raise PermissionNotFoundError(
                f"Permission '{permission_id}' was not found.",
            )

        if permission.role_permissions:
            raise PermissionInUseError(
                "Permission cannot be deleted because it "
                "is assigned to one or more roles.",
            )

        try:
            self.repository.delete(permission)
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()

            raise PermissionInUseError(
                "Permission cannot be deleted because it "
                "is currently in use.",
            ) from exc

    def statistics(self) -> PermissionStatistics:
        """Return permission statistics.

        Returns:
            Permission statistics.
        """
        total = self.repository.count()
        resources = self.repository.count_resources()

        assigned = 0

        for permission in self._all_permissions():
            assigned += len(permission.role_permissions)

        return PermissionStatistics(
            total=total,
            resources=resources,
            assigned=assigned,
            unassigned=max(total - assigned, 0),
        )


    def _all_permissions(self) -> builtins.list[Permission]:
        """Return all permissions for statistics.

        Returns:
            All permission entities.
        """
        return self.db.query(Permission).all()
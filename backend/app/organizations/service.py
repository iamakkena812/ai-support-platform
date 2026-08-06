"""Organization service."""

from __future__ import annotations

from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.organization import Organization
from app.organizations.repository import OrganizationRepository
from app.organizations.schemas import (
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
)


class OrganizationService:
    """Service for organization management."""

    def __init__(
        self,
        repository: OrganizationRepository,
    ) -> None:
        """Initialize the service."""
        self._repository = repository

    def create_organization(
        self,
        request: CreateOrganizationRequest,
    ) -> Organization:
        """Create an organization."""
        if self._repository.exists_by_name(request.name):
            raise ConflictException(
                "Organization name already exists.",
            )

        if self._repository.exists_by_code(request.code):
            raise ConflictException(
                "Organization code already exists.",
            )

        organization = Organization(
            name=request.name,
            code=request.code,
            email=request.email,
            phone=request.phone,
            website=str(request.website) if request.website else None,
            logo_url=str(request.logo_url) if request.logo_url else None,
            address=request.address,
            city=request.city,
            state=request.state,
            country=request.country,
            postal_code=request.postal_code,
            timezone=request.timezone,
        )

        return self._repository.create(
            organization,
        )

    def get_organization(
        self,
        organization_id: UUID,
    ) -> Organization:
        """Return an organization."""
        organization = self._repository.get(
            organization_id,
        )

        if organization is None:
            raise ResourceNotFoundException(
                "Organization not found.",
            )

        return organization

    def list_organizations(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Organization]:
        """Return organizations."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def update_organization(
        self,
        organization_id: UUID,
        request: UpdateOrganizationRequest,
    ) -> Organization:
        """Update an organization."""
        organization = self.get_organization(
            organization_id,
        )

        if request.name is not None and request.name != organization.name:
            if self._repository.exists_by_name(
                request.name,
            ):
                raise ConflictException(
                    "Organization name already exists.",
                )

            organization.name = request.name

        if request.code is not None and request.code != organization.code:
            if self._repository.exists_by_code(
                request.code,
            ):
                raise ConflictException(
                    "Organization code already exists.",
                )

            organization.code = request.code

        if request.email is not None:
            organization.email = request.email

        if request.phone is not None:
            organization.phone = request.phone

        if request.website is not None:
            organization.website = str(
                request.website,
            )

        if request.logo_url is not None:
            organization.logo_url = str(
                request.logo_url,
            )

        if request.address is not None:
            organization.address = request.address

        if request.city is not None:
            organization.city = request.city

        if request.state is not None:
            organization.state = request.state

        if request.country is not None:
            organization.country = request.country

        if request.postal_code is not None:
            organization.postal_code = request.postal_code

        if request.timezone is not None:
            organization.timezone = request.timezone

        if request.is_active is not None:
            organization.is_active = request.is_active

        return self._repository.update(
            organization,
        )

    def delete_organization(
        self,
        organization_id: UUID,
    ) -> None:
        """Delete an organization."""
        organization = self.get_organization(
            organization_id,
        )

        self._repository.delete(
            organization,
        )

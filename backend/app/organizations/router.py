"""Organization API router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Response, status

from app.auth.dependencies import CurrentSuperuserDependency
from app.organizations.dependencies import OrganizationServiceDependency
from app.organizations.schemas import (
    CreateOrganizationRequest,
    OrganizationListResponse,
    OrganizationResponse,
    UpdateOrganizationRequest,
)

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.post(
    "",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create organization",
)
async def create_organization(
    request: CreateOrganizationRequest,
    _: CurrentSuperuserDependency,
    service: OrganizationServiceDependency,
) -> OrganizationResponse:
    """Create a new organization."""
    organization = service.create_organization(request)

    return OrganizationResponse.model_validate(
        organization,
    )


@router.get(
    "",
    response_model=OrganizationListResponse,
    summary="List organizations",
)
async def list_organizations(
    _: CurrentSuperuserDependency,
    service: OrganizationServiceDependency,
) -> OrganizationListResponse:
    """Return all organizations."""
    organizations = service.list_organizations()

    return OrganizationListResponse(
        organizations=[
            OrganizationResponse.model_validate(org) for org in organizations
        ],
    )


@router.get(
    "/{organization_id}",
    response_model=OrganizationResponse,
    summary="Get organization",
)
async def get_organization(
    organization_id: UUID,
    _: CurrentSuperuserDependency,
    service: OrganizationServiceDependency,
) -> OrganizationResponse:
    """Return a single organization."""
    organization = service.get_organization(
        organization_id,
    )

    return OrganizationResponse.model_validate(
        organization,
    )


@router.patch(
    "/{organization_id}",
    response_model=OrganizationResponse,
    summary="Update organization",
)
async def update_organization(
    organization_id: UUID,
    request: UpdateOrganizationRequest,
    _: CurrentSuperuserDependency,
    service: OrganizationServiceDependency,
) -> OrganizationResponse:
    """Update an organization."""
    organization = service.update_organization(
        organization_id,
        request,
    )

    return OrganizationResponse.model_validate(
        organization,
    )


@router.delete(
    "/{organization_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete organization",
)
async def delete_organization(
    organization_id: UUID,
    _: CurrentSuperuserDependency,
    service: OrganizationServiceDependency,
) -> Response:
    """Soft-delete an organization."""
    service.delete_organization(
        organization_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )

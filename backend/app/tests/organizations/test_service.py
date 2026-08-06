"""Tests for organization service."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import uuid4

import pytest

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
from app.organizations.service import OrganizationService


@pytest.fixture
def repository() -> MagicMock:
    """Return mocked repository."""
    return MagicMock(spec=OrganizationRepository)


@pytest.fixture
def service(
    repository: MagicMock,
) -> OrganizationService:
    """Return organization service."""
    return OrganizationService(repository)


@pytest.fixture
def organization() -> Organization:
    """Return organization."""
    organization = MagicMock(spec=Organization)

    organization.id = uuid4()
    organization.name = "OpenAI"
    organization.code = "OPENAI"
    organization.email = "info@openai.com"
    organization.phone = "9999999999"
    organization.website = "https://openai.com"
    organization.is_active = True

    return organization


def test_create_organization_success(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Create organization."""
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = False
    repository.create.return_value = organization

    request = CreateOrganizationRequest(
        name="OpenAI",
        code="OPENAI",
        email="info@openai.com",
    )

    result = service.create_organization(request)

    assert result == organization
    repository.create.assert_called_once()


def test_create_duplicate_name(
    service: OrganizationService,
    repository: MagicMock,
) -> None:
    """Duplicate organization name."""
    repository.exists_by_name.return_value = True

    request = CreateOrganizationRequest(
        name="OpenAI",
        code="OPENAI",
    )

    with pytest.raises(ConflictException):
        service.create_organization(request)


def test_create_duplicate_code(
    service: OrganizationService,
    repository: MagicMock,
) -> None:
    """Duplicate organization code."""
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = True

    request = CreateOrganizationRequest(
        name="OpenAI",
        code="OPENAI",
    )

    with pytest.raises(ConflictException):
        service.create_organization(request)


def test_get_organization_success(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Get organization."""
    repository.get.return_value = organization

    result = service.get_organization(
        organization.id,
    )

    assert result == organization


def test_get_organization_not_found(
    service: OrganizationService,
    repository: MagicMock,
) -> None:
    """Organization not found."""
    repository.get.return_value = None

    with pytest.raises(
        ResourceNotFoundException,
    ):
        service.get_organization(uuid4())


def test_list_organizations(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """List organizations."""
    repository.list.return_value = [
        organization,
    ]

    result = service.list_organizations()

    assert result == [
        organization,
    ]

    repository.list.assert_called_once_with(
        offset=0,
        limit=100,
    )


def test_update_organization_success(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Update organization."""
    repository.get.return_value = organization
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = False
    repository.update.return_value = organization

    request = UpdateOrganizationRequest(
        name="Updated",
    )

    result = service.update_organization(
        organization.id,
        request,
    )

    assert result == organization


def test_update_duplicate_name(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Duplicate name."""
    repository.get.return_value = organization
    repository.exists_by_name.return_value = True

    request = UpdateOrganizationRequest(
        name="Another",
    )

    with pytest.raises(
        ConflictException,
    ):
        service.update_organization(
            organization.id,
            request,
        )


def test_update_duplicate_code(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Duplicate code."""
    repository.get.return_value = organization
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = True

    request = UpdateOrganizationRequest(
        code="NEWCODE",
    )

    with pytest.raises(
        ConflictException,
    ):
        service.update_organization(
            organization.id,
            request,
        )


def test_delete_organization(
    service: OrganizationService,
    repository: MagicMock,
    organization: Organization,
) -> None:
    """Delete organization."""
    repository.get.return_value = organization

    service.delete_organization(
        organization.id,
    )

    repository.delete.assert_called_once_with(
        organization,
    )


def test_delete_missing_organization(
    service: OrganizationService,
    repository: MagicMock,
) -> None:
    """Delete missing organization."""
    repository.get.return_value = None

    with pytest.raises(
        ResourceNotFoundException,
    ):
        service.delete_organization(
            uuid4(),
        )

"""Tests for organization repository."""

from __future__ import annotations

from uuid import uuid4

import pytest

from app.models.organization import Organization
from app.organizations.repository import OrganizationRepository

pytestmark = pytest.mark.asyncio


@pytest.mark.asyncio
async def test_create_organization(
    organization_repository: OrganizationRepository,
) -> None:
    """Create organization."""
    organization = Organization(
        name="OpenAI",
        code="OPENAI",
        email="info@openai.com",
        phone="1234567890",
        website="https://openai.com",
    )

    created = organization_repository.create(
        organization,
    )

    assert created.id is not None
    assert created.name == "OpenAI"
    assert created.code == "OPENAI"


@pytest.mark.asyncio
async def test_get_organization(
    organization_repository: OrganizationRepository,
) -> None:
    """Get organization by id."""
    unique = uuid4().hex[:8]
    organization = organization_repository.create(
        Organization(
            name=f"Org-{unique}",
            code=f"ORG-{unique}",
        )
    )

    found = organization_repository.get(
        organization.id,
    )

    assert found is not None
    assert found.id == organization.id


@pytest.mark.asyncio
async def test_get_missing_organization(
    organization_repository: OrganizationRepository,
) -> None:
    """Unknown organization."""
    found = organization_repository.get(
        uuid4(),
    )

    assert found is None


@pytest.mark.asyncio
async def test_get_by_name(
    organization_repository: OrganizationRepository,
) -> None:
    """Lookup by name."""
    organization = organization_repository.create(
        Organization(
            name="Microsoft",
            code="MSFT",
        )
    )

    found = organization_repository.get_by_name(
        "Microsoft",
    )

    assert found is not None
    assert found.id == organization.id


@pytest.mark.asyncio
async def test_get_by_code(
    organization_repository: OrganizationRepository,
) -> None:
    """Lookup by code."""
    organization = organization_repository.create(
        Organization(
            name="Google",
            code="GOOGLE",
        )
    )

    found = organization_repository.get_by_code(
        "GOOGLE",
    )

    assert found is not None
    assert found.id == organization.id


@pytest.mark.asyncio
async def test_exists_by_name(
    organization_repository: OrganizationRepository,
) -> None:
    """Organization name exists."""
    organization_repository.create(
        Organization(
            name="Amazon",
            code="AMZN",
        )
    )

    assert organization_repository.exists_by_name(
        "Amazon",
    )

    assert not organization_repository.exists_by_name(
        "Apple",
    )


@pytest.mark.asyncio
async def test_exists_by_code(
    organization_repository: OrganizationRepository,
) -> None:
    """Organization code exists."""
    organization_repository.create(
        Organization(
            name="Meta",
            code="META",
        )
    )

    assert organization_repository.exists_by_code(
        "META",
    )

    assert not organization_repository.exists_by_code(
        "APPLE",
    )


@pytest.mark.asyncio
async def test_list_organizations(
    organization_repository: OrganizationRepository,
) -> None:
    """List organizations."""
    organization_repository.create(
        Organization(
            name="Org A",
            code="A",
        )
    )

    organization_repository.create(
        Organization(
            name="Org B",
            code="B",
        )
    )

    organizations = organization_repository.list()

    assert len(organizations) >= 2


@pytest.mark.asyncio
async def test_update_organization(
    organization_repository: OrganizationRepository,
) -> None:
    """Update organization."""
    organization = organization_repository.create(
        Organization(
            name="Old Name",
            code="OLD",
        )
    )

    organization.name = "New Name"

    updated = organization_repository.update(
        organization,
    )

    assert updated.name == "New Name"


@pytest.mark.asyncio
async def test_delete_organization(
    organization_repository: OrganizationRepository,
) -> None:
    """Soft delete organization."""
    organization = organization_repository.create(
        Organization(
            name="Delete Me",
            code="DELETE",
        )
    )

    organization_repository.delete(
        organization,
    )

    assert (
        organization_repository.get(
            organization.id,
        )
        is not None
    )

    assert (
        organization_repository.get_by_name(
            "Delete Me",
        )
        is None
    )


@pytest.mark.asyncio
async def test_count_list_pagination(
    organization_repository: OrganizationRepository,
) -> None:
    """Pagination."""
    for index in range(5):
        organization_repository.create(
            Organization(
                name=f"Org {index}",
                code=f"ORG{index}",
            )
        )

    organizations = organization_repository.list(
        offset=0,
        limit=2,
    )

    assert len(organizations) == 2

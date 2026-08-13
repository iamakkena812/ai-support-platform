"""Tests for the AI Knowledge repository."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.ai.knowledge.constants import KnowledgeVisibility
from app.ai.knowledge.models import KnowledgeBase
from app.ai.knowledge.repository import AIKnowledgeRepository


def test_create_knowledge(
    db_session: Session,
) -> None:
    """Test creating a knowledge base."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    knowledge = KnowledgeBase(
        organization_id=organization_id,
        name="Knowledge Base",
        description="Knowledge description",
        created_by=uuid4(),
        updated_by=uuid4(),
    )

    created = repository.create(knowledge)

    assert created.id is not None
    assert created.organization_id == organization_id
    assert created.name == "Knowledge Base"
    assert created.description == "Knowledge description"


def test_get_by_id(
    db_session: Session,
) -> None:
    """Test getting a knowledge base by ID."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB",
            description="Description",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    found = repository.get_by_id(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
    )

    assert found is not None
    assert found.id == knowledge.id


def test_get_by_id_isolated_from_other_organization(
    db_session: Session,
) -> None:
    """Test a knowledge base is not visible from another organization."""
    repository = AIKnowledgeRepository(db_session)

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=uuid4(),
            name="KB",
            description="Description",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    found = repository.get_by_id(
        knowledge_id=knowledge.id,
        organization_id=uuid4(),
    )

    assert found is None


def test_get_by_name(
    db_session: Session,
) -> None:
    """Test getting a knowledge base by name."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Support",
            description="Support KB",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    found = repository.get_by_name(
        organization_id=organization_id,
        name="Support",
    )

    assert found is not None
    assert found.name == "Support"


def test_list_knowledge(
    db_session: Session,
) -> None:
    """Test listing knowledge bases owned by the caller."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()
    user_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB 1",
            description=None,
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB 2",
            description=None,
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    results = repository.list(
        organization_id=organization_id,
        user_id=user_id,
    )

    assert len(results) == 2


def test_list_knowledge_includes_organization_wide_items(
    db_session: Session,
) -> None:
    """Test listing includes organization-wide items from other users."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Shared",
            visibility=KnowledgeVisibility.ORGANIZATION,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    results = repository.list(
        organization_id=organization_id,
        user_id=uuid4(),
    )

    assert len(results) == 1
    assert results[0].name == "Shared"


def test_list_knowledge_excludes_other_users_private_items(
    db_session: Session,
) -> None:
    """Test listing excludes private items owned by other users."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Private",
            visibility=KnowledgeVisibility.PRIVATE,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    results = repository.list(
        organization_id=organization_id,
        user_id=uuid4(),
    )

    assert results == []


def test_count_knowledge_excludes_other_users_private_items(
    db_session: Session,
) -> None:
    """Test counting excludes private items owned by other users."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Private",
            visibility=KnowledgeVisibility.PRIVATE,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    assert (
        repository.count(
            organization_id=organization_id,
            user_id=uuid4(),
        )
        == 0
    )


def test_exists(
    db_session: Session,
) -> None:
    """Test checking whether a knowledge base exists."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Support",
            description=None,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    assert repository.exists(
        organization_id=organization_id,
        name="Support",
    )


def test_update(
    db_session: Session,
) -> None:
    """Test updating a knowledge base."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Old",
            description=None,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    knowledge.name = "New"

    updated = repository.update(knowledge)

    assert updated.name == "New"


def test_delete(
    db_session: Session,
) -> None:
    """Test deleting a knowledge base."""
    repository = AIKnowledgeRepository(db_session)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Delete",
            description=None,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    repository.delete(knowledge)

    assert (
        repository.get_by_id(
            knowledge_id=knowledge.id,
            organization_id=organization_id,
        )
        is None
    )

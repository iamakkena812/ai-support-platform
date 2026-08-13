"""Tests for the AI Knowledge service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.ai.knowledge.constants import KnowledgeVisibility
from app.ai.knowledge.exceptions import (
    KnowledgeAlreadyExistsError,
    KnowledgeNotFoundError,
)
from app.ai.knowledge.models import KnowledgeBase
from app.ai.knowledge.repository import AIKnowledgeRepository
from app.ai.knowledge.schemas import (
    KnowledgeCreate,
    KnowledgeUpdate,
)
from app.ai.knowledge.service import AIKnowledgeService
from app.core.exceptions import AuthorizationException


def test_create_knowledge(
    db_session: Session,
) -> None:
    """Test creating a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    response = service.create_knowledge(
        organization_id=organization_id,
        user_id=uuid4(),
        request=KnowledgeCreate(
            name="Knowledge Base",
            description="Knowledge description",
        ),
    )

    assert response.organization_id == organization_id
    assert response.name == "Knowledge Base"
    assert response.description == "Knowledge description"
    assert response.visibility == KnowledgeVisibility.PRIVATE


def test_create_duplicate_knowledge(
    db_session: Session,
) -> None:
    """Test creating a duplicate knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    service.create_knowledge(
        organization_id=organization_id,
        user_id=uuid4(),
        request=KnowledgeCreate(
            name="Support",
        ),
    )

    with pytest.raises(KnowledgeAlreadyExistsError):
        service.create_knowledge(
            organization_id=organization_id,
            user_id=uuid4(),
            request=KnowledgeCreate(
                name="Support",
            ),
        )


def test_get_knowledge(
    db_session: Session,
) -> None:
    """Test retrieving a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()
    user_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB",
            description="Description",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    response = service.get_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
        user_id=user_id,
    )

    assert response.id == knowledge.id


def test_get_knowledge_not_found(
    db_session: Session,
) -> None:
    """Test retrieving a missing knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    with pytest.raises(KnowledgeNotFoundError):
        service.get_knowledge(
            knowledge_id=uuid4(),
            organization_id=uuid4(),
            user_id=uuid4(),
        )


def test_get_knowledge_isolated_from_other_organization(
    db_session: Session,
) -> None:
    """Test a knowledge base cannot be fetched from another organization."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    user_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=uuid4(),
            name="KB",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    with pytest.raises(KnowledgeNotFoundError):
        service.get_knowledge(
            knowledge_id=knowledge.id,
            organization_id=uuid4(),
            user_id=user_id,
        )


def test_get_private_knowledge_rejects_non_owner(
    db_session: Session,
) -> None:
    """Test a private knowledge base is not visible to other users."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Private KB",
            visibility=KnowledgeVisibility.PRIVATE,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    with pytest.raises(AuthorizationException):
        service.get_knowledge(
            knowledge_id=knowledge.id,
            organization_id=organization_id,
            user_id=uuid4(),
        )


def test_get_organization_visible_knowledge_allows_non_owner(
    db_session: Session,
) -> None:
    """Test an organization-visible knowledge base is readable by others."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Shared KB",
            visibility=KnowledgeVisibility.ORGANIZATION,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    response = service.get_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
        user_id=uuid4(),
    )

    assert response.id == knowledge.id


def test_list_knowledge(
    db_session: Session,
) -> None:
    """Test listing knowledge bases owned by the caller."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()
    user_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB1",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB2",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    response = service.list_knowledge(
        organization_id=organization_id,
        user_id=user_id,
    )

    assert response.total == 2
    assert len(response.items) == 2


def test_list_knowledge_excludes_other_users_private_items(
    db_session: Session,
) -> None:
    """Test listing excludes private items owned by other users."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

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

    response = service.list_knowledge(
        organization_id=organization_id,
        user_id=uuid4(),
    )

    assert response.total == 0
    assert response.items == []


def test_update_knowledge(
    db_session: Session,
) -> None:
    """Test updating a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()
    user_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Old Name",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    response = service.update_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
        user_id=user_id,
        request=KnowledgeUpdate(
            name="New Name",
        ),
    )

    assert response.name == "New Name"


def test_update_knowledge_not_found(
    db_session: Session,
) -> None:
    """Test updating a missing knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    with pytest.raises(KnowledgeNotFoundError):
        service.update_knowledge(
            knowledge_id=uuid4(),
            organization_id=uuid4(),
            user_id=uuid4(),
            request=KnowledgeUpdate(
                name="Updated",
            ),
        )


def test_update_knowledge_rejects_non_owner(
    db_session: Session,
) -> None:
    """Test only the creator may update a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Shared",
            visibility=KnowledgeVisibility.ORGANIZATION,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    with pytest.raises(AuthorizationException):
        service.update_knowledge(
            knowledge_id=knowledge.id,
            organization_id=organization_id,
            user_id=uuid4(),
            request=KnowledgeUpdate(name="Hijacked"),
        )


def test_delete_knowledge(
    db_session: Session,
) -> None:
    """Test deleting a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()
    user_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Delete Me",
            created_by=user_id,
            updated_by=user_id,
        ),
    )

    service.delete_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
        user_id=user_id,
    )

    assert (
        repository.get_by_id(
            knowledge_id=knowledge.id,
            organization_id=organization_id,
        )
        is None
    )


def test_delete_knowledge_not_found(
    db_session: Session,
) -> None:
    """Test deleting a missing knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    with pytest.raises(KnowledgeNotFoundError):
        service.delete_knowledge(
            knowledge_id=uuid4(),
            organization_id=uuid4(),
            user_id=uuid4(),
        )


def test_delete_knowledge_rejects_non_owner(
    db_session: Session,
) -> None:
    """Test only the creator may delete a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Shared",
            visibility=KnowledgeVisibility.ORGANIZATION,
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    with pytest.raises(AuthorizationException):
        service.delete_knowledge(
            knowledge_id=knowledge.id,
            organization_id=organization_id,
            user_id=uuid4(),
        )

"""Tests for the AI Knowledge service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

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

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB",
            description="Description",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    response = service.get_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
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
        )


def test_list_knowledge(
    db_session: Session,
) -> None:
    """Test listing knowledge bases."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB1",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="KB2",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    response = service.list_knowledge(
        organization_id=organization_id,
    )

    assert response.total == 2
    assert len(response.items) == 2


def test_update_knowledge(
    db_session: Session,
) -> None:
    """Test updating a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Old Name",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    response = service.update_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
        user_id=uuid4(),
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


def test_delete_knowledge(
    db_session: Session,
) -> None:
    """Test deleting a knowledge base."""
    repository = AIKnowledgeRepository(db_session)
    service = AIKnowledgeService(repository)

    organization_id = uuid4()

    knowledge = repository.create(
        KnowledgeBase(
            organization_id=organization_id,
            name="Delete Me",
            created_by=uuid4(),
            updated_by=uuid4(),
        ),
    )

    service.delete_knowledge(
        knowledge_id=knowledge.id,
        organization_id=organization_id,
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
        )

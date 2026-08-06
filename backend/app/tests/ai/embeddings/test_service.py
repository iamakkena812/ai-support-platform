"""Tests for the AI Embeddings service."""

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.ai.embeddings.constants import (
    DEFAULT_EMBEDDING_DIMENSIONS,
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.exceptions import (
    EmbeddingAlreadyExistsError,
    EmbeddingNotFoundError,
)
from app.ai.embeddings.models import Embedding
from app.ai.embeddings.repository import AIEmbeddingRepository
from app.ai.embeddings.schemas import (
    EmbeddingCreate,
    EmbeddingUpdate,
)
from app.ai.embeddings.service import AIEmbeddingService

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User


@pytest.fixture
def embedding_service(
    db_session: Session,
) -> AIEmbeddingService:
    """Create an embedding service."""
    return AIEmbeddingService(
        AIEmbeddingRepository(db_session),
    )


@pytest.fixture
def embedding_request() -> EmbeddingCreate:
    """Create an embedding request."""
    return EmbeddingCreate(
        provider=EmbeddingProvider.OPENAI,
        model="text-embedding-3-small",
        source_type=EmbeddingSourceType.DOCUMENT,
        source_id=uuid4(),
        content="Sample document",
        metadata={},
    )


def test_create_embedding(
    embedding_service: AIEmbeddingService,
    embedding_request: EmbeddingCreate,
    organization: Organization,
    user: User,
) -> None:
    """Test creating an embedding."""
    response = embedding_service.create(
        organization_id=organization.id,
        user_id=user.id,
        request=embedding_request,
    )

    assert response.id is not None
    assert response.organization_id == organization.id
    assert response.provider == EmbeddingProvider.OPENAI
    assert response.status == EmbeddingStatus.PENDING
    assert response.dimensions == DEFAULT_EMBEDDING_DIMENSIONS


def test_create_duplicate_embedding(
    embedding_service: AIEmbeddingService,
    embedding_request: EmbeddingCreate,
    organization: Organization,
    user: User,
) -> None:
    """Test duplicate embedding creation."""
    embedding_service.create(
        organization_id=organization.id,
        user_id=user.id,
        request=embedding_request,
    )

    with pytest.raises(EmbeddingAlreadyExistsError):
        embedding_service.create(
            organization_id=organization.id,
            user_id=user.id,
            request=embedding_request,
        )


def test_get_embedding(
    embedding_service: AIEmbeddingService,
    embedding_request: EmbeddingCreate,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving an embedding."""
    created = embedding_service.create(
        organization_id=organization.id,
        user_id=user.id,
        request=embedding_request,
    )

    result = embedding_service.get(
        embedding_id=created.id,
        organization_id=organization.id,
    )

    assert result.id == created.id


def test_get_embedding_not_found(
    embedding_service: AIEmbeddingService,
    organization: Organization,
) -> None:
    """Test retrieving a missing embedding."""
    with pytest.raises(EmbeddingNotFoundError):
        embedding_service.get(
            embedding_id=uuid4(),
            organization_id=organization.id,
        )


def test_list_embeddings(
    organization: Organization,
    embedding: Embedding,
    embedding_service: AIEmbeddingService,
) -> None:
    """Test listing embeddings."""
    response = embedding_service.list_embeddings(
        organization_id=organization.id,
        offset=0,
        limit=20,
    )

    assert response.total == 1
    assert len(response.items) == 1


def test_update_embedding(
    db_session: Session,
    embedding_service: AIEmbeddingService,
    organization: Organization,
    user: User,
) -> None:
    """Test updating an embedding."""
    repository = AIEmbeddingRepository(db_session)

    embedding = repository.create(
        Embedding(
            organization_id=organization.id,
            knowledge_id=None,
            provider=EmbeddingProvider.OPENAI,
            model="text-embedding-3-small",
            source_type=EmbeddingSourceType.DOCUMENT,
            source_id=uuid4(),
            content="Old content",
            dimensions=1536,
            vector=[],
            metadata_json={},
            status=EmbeddingStatus.PENDING,
            created_by=user.id,
            updated_by=user.id,
        ),
    )

    response = embedding_service.update(
        embedding_id=embedding.id,
        organization_id=organization.id,
        user_id=user.id,
        request=EmbeddingUpdate(
            content="Updated content",
            status=EmbeddingStatus.READY,
        ),
    )

    assert response.content == "Updated content"
    assert response.status == EmbeddingStatus.READY


def test_update_embedding_not_found(
    embedding_service: AIEmbeddingService,
    organization: Organization,
    user: User,
) -> None:
    """Test updating a missing embedding."""
    with pytest.raises(EmbeddingNotFoundError):
        embedding_service.update(
            embedding_id=uuid4(),
            organization_id=organization.id,
            user_id=user.id,
            request=EmbeddingUpdate(
                content="Updated",
            ),
        )


def test_delete_embedding(
    embedding_service: AIEmbeddingService,
    embedding_request: EmbeddingCreate,
    organization: Organization,
    user: User,
) -> None:
    """Test deleting an embedding."""
    created = embedding_service.create(
        organization_id=organization.id,
        user_id=user.id,
        request=embedding_request,
    )

    embedding_service.delete(
        embedding_id=created.id,
        organization_id=organization.id,
    )

    with pytest.raises(EmbeddingNotFoundError):
        embedding_service.get(
            embedding_id=created.id,
            organization_id=organization.id,
        )


def test_delete_embedding_not_found(
    embedding_service: AIEmbeddingService,
    organization: Organization,
) -> None:
    """Test deleting a missing embedding."""
    with pytest.raises(EmbeddingNotFoundError):
        embedding_service.delete(
            embedding_id=uuid4(),
            organization_id=organization.id,
        )

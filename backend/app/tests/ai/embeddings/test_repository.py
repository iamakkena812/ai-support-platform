"""Tests for the AI Embeddings repository."""

from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.models import Embedding
from app.ai.embeddings.repository import AIEmbeddingRepository

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User


def create_embedding(
    organization_id: UUID,
    user_id: UUID,
) -> Embedding:
    """Create an embedding instance for testing.

    Args:
        organization_id: Organization identifier.
        user_id: User identifier.

    Returns:
        A populated Embedding model.
    """
    return Embedding(
        organization_id=organization_id,
        knowledge_id=None,
        provider=EmbeddingProvider.OPENAI,
        model="text-embedding-3-small",
        source_type=EmbeddingSourceType.DOCUMENT,
        source_id=uuid4(),
        content="Sample embedding content",
        dimensions=1536,
        vector=[0.1, 0.2, 0.3],
        metadata_json={},
        status=EmbeddingStatus.READY,
        created_by=user_id,
        updated_by=user_id,
    )


def test_create_embedding(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test creating an embedding."""
    repository = AIEmbeddingRepository(db_session)

    embedding = create_embedding(
        organization.id,
        user.id,
    )

    created = repository.create(embedding)

    assert created.id is not None
    assert created.organization_id == organization.id


def test_get_by_id(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving an embedding."""
    repository = AIEmbeddingRepository(db_session)

    embedding = repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    result = repository.get_by_id(
        embedding.id,
        organization.id,
    )

    assert result is not None
    assert result.id == embedding.id


def test_get_by_id_not_found(
    db_session: Session,
    organization: Organization,
) -> None:
    """Test retrieving a missing embedding."""
    repository = AIEmbeddingRepository(db_session)

    result = repository.get_by_id(
        uuid4(),
        organization.id,
    )

    assert result is None


def test_list_embeddings(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test listing embeddings."""
    repository = AIEmbeddingRepository(db_session)

    repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    results = repository.list_embeddings(
        organization_id=organization.id,
    )

    assert len(results) == 2


def test_count_embeddings(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test counting embeddings."""
    repository = AIEmbeddingRepository(db_session)

    repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    assert (
        repository.count(
            organization.id,
        )
        == 2
    )


def test_update_embedding(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test updating an embedding."""
    repository = AIEmbeddingRepository(db_session)

    embedding = repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    embedding.content = "Updated content"

    updated = repository.update(embedding)

    assert updated.content == "Updated content"


def test_delete_embedding(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test deleting an embedding."""
    repository = AIEmbeddingRepository(db_session)

    embedding = repository.create(
        create_embedding(
            organization.id,
            user.id,
        ),
    )

    embedding_id = embedding.id

    repository.delete(embedding)

    deleted = repository.get_by_id(
        embedding_id,
        organization.id,
    )

    assert deleted is None

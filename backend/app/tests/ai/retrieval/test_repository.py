"""Tests for the AI Retrieval repository."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.models import Embedding
from app.ai.retrieval.repository import RetrievalRepository
from app.models.organization import Organization


def _make_embedding(
    db_session: Session,
    organization_id: object,
    user_id: object,
    *,
    content: str,
    metadata: dict[str, object] | None = None,
) -> Embedding:
    """Persist an embedding with the given content."""
    embedding = Embedding(
        organization_id=organization_id,
        knowledge_id=None,
        provider=EmbeddingProvider.OPENAI,
        model="text-embedding-3-small",
        source_type=EmbeddingSourceType.DOCUMENT,
        source_id=uuid4(),
        content=content,
        dimensions=1536,
        vector=[],
        metadata_json=metadata or {},
        status=EmbeddingStatus.PENDING,
        created_by=user_id,
        updated_by=user_id,
    )
    db_session.add(embedding)
    db_session.commit()
    db_session.refresh(embedding)

    return embedding


def test_search_by_terms_returns_matching_results(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Search should return embeddings whose content contains a term."""
    results = retrieval_repository.search_by_terms(
        embedding.organization_id,
        ["test"],
    )

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_search_by_terms_excludes_non_matching_content(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Search should exclude embeddings that do not contain any term."""
    results = retrieval_repository.search_by_terms(
        embedding.organization_id,
        ["unrelated-keyword"],
    )

    assert results == []


def test_search_by_terms_with_no_terms_returns_all_org_embeddings(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """An empty term list should not filter by content."""
    results = retrieval_repository.search_by_terms(
        embedding.organization_id,
        [],
    )

    assert len(results) == 1


def test_search_by_terms_isolated_from_other_organization(
    retrieval_repository: RetrievalRepository,
    db_session: Session,
    embedding: Embedding,
) -> None:
    """Search must never return another organization's embeddings."""
    other_organization = Organization(
        name="Other Retrieval Org",
        code=f"OTHERRET-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-retrieval.com",
        phone="+919999999997",
        website="https://other-retrieval.com",
        logo_url="https://other-retrieval.com/logo.png",
        address="1 Other Retrieval Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500003",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    _make_embedding(
        db_session,
        other_organization.id,
        embedding.created_by,
        content="Test embedding in another organization",
    )

    results = retrieval_repository.search_by_terms(
        embedding.organization_id,
        ["test"],
    )

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_search_by_terms_respects_limit(
    retrieval_repository: RetrievalRepository,
    db_session: Session,
    embedding: Embedding,
) -> None:
    """Search should respect the candidate limit."""
    _make_embedding(
        db_session,
        embedding.organization_id,
        embedding.created_by,
        content="Test embedding number two",
    )

    results = retrieval_repository.search_by_terms(
        embedding.organization_id,
        ["test"],
        limit=1,
    )

    assert len(results) == 1


def test_metadata_search_returns_results(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Metadata search should return matching embeddings."""
    results = retrieval_repository.metadata_search(
        embedding.organization_id,
        metadata=embedding.metadata_json,
    )

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_metadata_search_returns_empty_list(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Metadata search should return an empty list for non-matching filters."""
    results = retrieval_repository.metadata_search(
        embedding.organization_id,
        metadata={"source": "unknown"},
    )

    assert results == []


def test_metadata_search_isolated_from_other_organization(
    retrieval_repository: RetrievalRepository,
    db_session: Session,
    embedding: Embedding,
) -> None:
    """Metadata search must never return another organization's embeddings."""
    other_organization = Organization(
        name="Other Metadata Org",
        code=f"OTHERMETA-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-metadata.com",
        phone="+919999999996",
        website="https://other-metadata.com",
        logo_url="https://other-metadata.com/logo.png",
        address="1 Other Metadata Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500004",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    _make_embedding(
        db_session,
        other_organization.id,
        embedding.created_by,
        content="Other org metadata embedding",
        metadata=embedding.metadata_json,
    )

    results = retrieval_repository.metadata_search(
        embedding.organization_id,
        metadata=embedding.metadata_json,
    )

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_count_documents_returns_total(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Count should return the total indexed documents for the organization."""
    count = retrieval_repository.count_documents(embedding.organization_id)

    assert count == 1


def test_count_documents_isolated_from_other_organization(
    retrieval_repository: RetrievalRepository,
    db_session: Session,
    embedding: Embedding,
) -> None:
    """Count must not include another organization's embeddings."""
    other_organization = Organization(
        name="Other Count Org",
        code=f"OTHERCOUNT-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-count.com",
        phone="+919999999995",
        website="https://other-count.com",
        logo_url="https://other-count.com/logo.png",
        address="1 Other Count Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500005",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    _make_embedding(
        db_session,
        other_organization.id,
        embedding.created_by,
        content="Other org embedding",
    )

    count = retrieval_repository.count_documents(embedding.organization_id)

    assert count == 1

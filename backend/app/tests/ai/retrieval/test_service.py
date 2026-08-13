"""Tests for the AI Retrieval service."""

from __future__ import annotations

from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.models import Embedding
from app.ai.retrieval.constants import DEFAULT_PROVIDER
from app.ai.retrieval.exceptions import (
    UnsupportedRetrievalProviderError,
)
from app.ai.retrieval.schemas import (
    HybridRetrievalRequest,
    MetadataSearchRequest,
    RetrievalRequest,
)
from app.ai.retrieval.service import RetrievalService


def _make_embedding(
    db_session: Session,
    organization_id: object,
    user_id: object,
    *,
    content: str,
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
        metadata_json={},
        status=EmbeddingStatus.PENDING,
        created_by=user_id,
        updated_by=user_id,
    )
    db_session.add(embedding)
    db_session.commit()
    db_session.refresh(embedding)

    return embedding


def test_retrieve_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieve should return matching documents scored by keyword relevance."""
    request = RetrievalRequest(
        query="Test",
        score_threshold=0.0,
    )

    response = retrieval_service.retrieve(embedding.organization_id, request)

    assert response.provider == DEFAULT_PROVIDER
    assert len(response.documents) == 1
    assert response.total_documents == 1
    assert response.documents[0].score > 0.0


def test_retrieve_returns_empty_for_unmatched_query(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieve should return no results when the query has zero relevance."""
    request = RetrievalRequest(
        query="completely-unrelated-term",
        score_threshold=0.0,
    )

    response = retrieval_service.retrieve(embedding.organization_id, request)

    assert response.documents == []
    assert response.total_documents == 0


def test_retrieve_is_isolated_from_other_organization(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieve must never return results for an unrelated organization."""
    request = RetrievalRequest(
        query="Test",
        score_threshold=0.0,
    )

    response = retrieval_service.retrieve(uuid4(), request)

    assert response.documents == []
    assert response.total_documents == 0


def test_retrieve_different_queries_produce_different_scores(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Different queries should produce different relevance scores."""
    strong_match = RetrievalRequest(
        query="Test embedding",
        score_threshold=0.0,
    )
    weak_match = RetrievalRequest(
        query="Test unrelated",
        score_threshold=0.0,
    )

    strong_response = retrieval_service.retrieve(
        embedding.organization_id,
        strong_match,
    )
    weak_response = retrieval_service.retrieve(
        embedding.organization_id,
        weak_match,
    )

    assert strong_response.documents[0].score == 1.0
    assert weak_response.documents[0].score == 0.5
    assert strong_response.documents[0].score != weak_response.documents[0].score


def test_retrieve_ranks_results_by_relevance_descending(
    retrieval_service: RetrievalService,
    db_session: Session,
    embedding: Embedding,
) -> None:
    """Results should be sorted with the most relevant document first."""
    _make_embedding(
        db_session,
        embedding.organization_id,
        embedding.created_by,
        content="Test",
    )

    request = RetrievalRequest(
        query="Test embedding",
        score_threshold=0.0,
        top_k=10,
    )

    response = retrieval_service.retrieve(embedding.organization_id, request)

    scores = [document.score for document in response.documents]

    assert scores == sorted(scores, reverse=True)
    assert response.documents[0].content == embedding.content


def test_retrieve_excludes_results_below_score_threshold(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Results below the requested score threshold should be excluded."""
    request = RetrievalRequest(
        query="Test unrelated",
        score_threshold=0.9,
    )

    response = retrieval_service.retrieve(embedding.organization_id, request)

    assert response.documents == []


def test_hybrid_retrieve_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Hybrid retrieval should return matching documents."""
    request = HybridRetrievalRequest(
        query="Test",
        score_threshold=0.0,
    )

    response = retrieval_service.hybrid_retrieve(
        embedding.organization_id,
        request,
    )

    assert len(response.documents) == 1
    assert response.total_documents == 1


def test_hybrid_retrieve_scales_score_by_keyword_weight(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Hybrid score reflects only the keyword contribution.

    No embedding provider is configured, so the semantic component always
    contributes zero; the returned score is capped by ``keyword_weight``.
    """
    request = HybridRetrievalRequest(
        query="Test",
        score_threshold=0.0,
        keyword_weight=0.4,
        semantic_weight=0.6,
    )

    response = retrieval_service.hybrid_retrieve(
        embedding.organization_id,
        request,
    )

    assert response.documents[0].score == pytest.approx(0.4)


def test_hybrid_retrieve_is_isolated_from_other_organization(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Hybrid retrieval must never return results for an unrelated organization."""
    request = HybridRetrievalRequest(
        query="Test",
        score_threshold=0.0,
    )

    response = retrieval_service.hybrid_retrieve(uuid4(), request)

    assert response.documents == []


def test_metadata_search_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Metadata search should return matching documents."""
    request = MetadataSearchRequest(
        metadata=embedding.metadata_json,
    )

    response = retrieval_service.metadata_search(
        embedding.organization_id,
        request,
    )

    assert len(response.documents) == 1
    assert response.total_documents == 1


def test_metadata_search_returns_empty_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Metadata search should return an empty result for non-matching filters."""
    request = MetadataSearchRequest(
        metadata={"source": "unknown"},
    )

    response = retrieval_service.metadata_search(
        embedding.organization_id,
        request,
    )

    assert response.documents == []
    assert response.total_documents == 0


def test_metadata_search_is_isolated_from_other_organization(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Metadata search must never return results for an unrelated organization."""
    request = MetadataSearchRequest(
        metadata=embedding.metadata_json,
    )

    response = retrieval_service.metadata_search(uuid4(), request)

    assert response.documents == []


def test_providers_returns_supported_providers(
    retrieval_service: RetrievalService,
) -> None:
    """Providers should return supported providers."""
    response = retrieval_service.providers()

    assert len(response.providers) == 1
    assert response.providers[0].name == DEFAULT_PROVIDER
    assert response.providers[0].available is True


def test_statistics_returns_summary(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Statistics should return retrieval statistics for the organization."""
    response = retrieval_service.statistics(embedding.organization_id)

    assert response.provider == DEFAULT_PROVIDER
    assert response.total_documents == 1
    assert response.indexed_documents == 1


def test_statistics_is_isolated_from_other_organization(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Statistics must not include another organization's embeddings."""
    response = retrieval_service.statistics(uuid4())

    assert response.total_documents == 0


def test_invalid_provider_raises_error(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Unsupported provider should raise an exception."""
    request = RetrievalRequest(
        query="Hello",
        provider="invalid-provider",
    )

    with pytest.raises(
        UnsupportedRetrievalProviderError,
    ):
        retrieval_service.retrieve(embedding.organization_id, request)


def test_validate_provider_accepts_default() -> None:
    """Default provider should be accepted."""
    RetrievalService._validate_provider(
        DEFAULT_PROVIDER,
    )


def test_retrieve_returns_metadata(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieved document should include metadata."""
    request = RetrievalRequest(
        query="Test",
        score_threshold=0.0,
    )

    response = retrieval_service.retrieve(embedding.organization_id, request)

    assert response.documents[0].metadata == embedding.metadata_json


def test_tokenize_normalizes_case_and_punctuation() -> None:
    """Tokenizer should lowercase and strip punctuation."""
    terms = RetrievalService._tokenize("What is AI?")

    assert terms == ["what", "is", "ai"]

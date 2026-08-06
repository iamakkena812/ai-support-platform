"""Service for the AI Embeddings module."""

from __future__ import annotations

from uuid import UUID

from app.ai.embeddings.constants import (
    DEFAULT_EMBEDDING_DIMENSIONS,
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
    EmbeddingListResponse,
    EmbeddingResponse,
    EmbeddingUpdate,
)


class AIEmbeddingService:
    """Business logic for AI Embeddings."""

    def __init__(
        self,
        repository: AIEmbeddingRepository,
    ) -> None:
        """Initialize the service.

        Args:
            repository: Embedding repository.
        """
        self._repository = repository

    @staticmethod
    def _to_response(
        embedding: Embedding,
    ) -> EmbeddingResponse:
        """Convert an embedding model to a response schema."""
        return EmbeddingResponse(
            id=embedding.id,
            organization_id=embedding.organization_id,
            knowledge_id=embedding.knowledge_id,
            provider=embedding.provider,
            model=embedding.model,
            source_type=embedding.source_type,
            source_id=embedding.source_id,
            content=embedding.content,
            dimensions=embedding.dimensions,
            vector=embedding.vector,
            metadata=embedding.metadata_json,
            status=embedding.status,
            created_by=embedding.created_by,
            updated_by=embedding.updated_by,
            created_at=embedding.created_at,
            updated_at=embedding.updated_at,
        )

    def create(
        self,
        organization_id: UUID,
        user_id: UUID,
        request: EmbeddingCreate,
    ) -> EmbeddingResponse:
        """Create an embedding."""
        if self._repository.exists(
            organization_id=organization_id,
            source_id=request.source_id,
        ):
            raise EmbeddingAlreadyExistsError()

        embedding = Embedding(
            organization_id=organization_id,
            knowledge_id=request.knowledge_id,
            provider=request.provider,
            model=request.model,
            source_type=request.source_type,
            source_id=request.source_id,
            content=request.content,
            dimensions=DEFAULT_EMBEDDING_DIMENSIONS,
            vector=[],
            metadata_json=request.metadata,
            status=EmbeddingStatus.PENDING,
            created_by=user_id,
            updated_by=user_id,
        )

        embedding = self._repository.create(embedding)

        return self._to_response(embedding)

    def get(
        self,
        embedding_id: UUID,
        organization_id: UUID,
    ) -> EmbeddingResponse:
        """Retrieve an embedding."""
        embedding = self._repository.get_by_id(
            embedding_id=embedding_id,
            organization_id=organization_id,
        )

        if embedding is None:
            raise EmbeddingNotFoundError()

        return self._to_response(embedding)

    def list_embeddings(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> EmbeddingListResponse:
        """List embeddings."""
        embeddings = self._repository.list_embeddings(
            organization_id=organization_id,
            offset=offset,
            limit=limit,
        )

        total = self._repository.count(
            organization_id=organization_id,
        )

        return EmbeddingListResponse(
            items=[self._to_response(item) for item in embeddings],
            total=total,
            offset=offset,
            limit=limit,
        )

    def update(
        self,
        embedding_id: UUID,
        organization_id: UUID,
        user_id: UUID,
        request: EmbeddingUpdate,
    ) -> EmbeddingResponse:
        """Update an embedding."""
        embedding = self._repository.get_by_id(
            embedding_id=embedding_id,
            organization_id=organization_id,
        )

        if embedding is None:
            raise EmbeddingNotFoundError()

        update_data = request.model_dump(
            exclude_unset=True,
        )

        if "provider" in update_data:
            embedding.provider = update_data["provider"]

        if "model" in update_data:
            embedding.model = update_data["model"]

        if "content" in update_data:
            embedding.content = update_data["content"]

        if "metadata" in update_data:
            embedding.metadata_json = update_data["metadata"]

        if "status" in update_data:
            embedding.status = update_data["status"]

        embedding.updated_by = user_id

        embedding = self._repository.update(
            embedding,
        )

        return self._to_response(embedding)

    def delete(
        self,
        embedding_id: UUID,
        organization_id: UUID,
    ) -> None:
        """Delete an embedding."""
        embedding = self._repository.get_by_id(
            embedding_id=embedding_id,
            organization_id=organization_id,
        )

        if embedding is None:
            raise EmbeddingNotFoundError()

        self._repository.delete(
            embedding,
        )

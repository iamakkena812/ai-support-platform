"""Constants for the AI Vector Store module."""

from __future__ import annotations

# ============================================================================
# Pagination
# ============================================================================

DEFAULT_OFFSET: int = 0
DEFAULT_LIMIT: int = 100
MAX_LIMIT: int = 1000

# ============================================================================
# Search
# ============================================================================

DEFAULT_TOP_K: int = 5
MAX_TOP_K: int = 100

DEFAULT_SIMILARITY_THRESHOLD: float = 0.0
MIN_SIMILARITY_THRESHOLD: float = 0.0
MAX_SIMILARITY_THRESHOLD: float = 1.0

# ============================================================================
# Search Types
# ============================================================================

SEARCH_TYPE_SEMANTIC: str = "semantic"
SEARCH_TYPE_SIMILAR: str = "similar"
SEARCH_TYPE_HYBRID: str = "hybrid"

SEARCH_TYPES: tuple[str, ...] = (
    SEARCH_TYPE_SEMANTIC,
    SEARCH_TYPE_SIMILAR,
    SEARCH_TYPE_HYBRID,
)

# ============================================================================
# Vector Providers
# ============================================================================

PROVIDER_OPENAI: str = "openai"
PROVIDER_AZURE_OPENAI: str = "azure_openai"
PROVIDER_OLLAMA: str = "ollama"
PROVIDER_PGVECTOR: str = "pgvector"
PROVIDER_PINECONE: str = "pinecone"
PROVIDER_QDRANT: str = "qdrant"
PROVIDER_WEAVIATE: str = "weaviate"
PROVIDER_CHROMA: str = "chroma"
PROVIDER_MILVUS: str = "milvus"
PROVIDER_ELASTICSEARCH: str = "elasticsearch"

SUPPORTED_PROVIDERS: tuple[str, ...] = (
    PROVIDER_OPENAI,
    PROVIDER_AZURE_OPENAI,
    PROVIDER_OLLAMA,
    PROVIDER_PGVECTOR,
    PROVIDER_PINECONE,
    PROVIDER_QDRANT,
    PROVIDER_WEAVIATE,
    PROVIDER_CHROMA,
    PROVIDER_MILVUS,
    PROVIDER_ELASTICSEARCH,
)

DEFAULT_PROVIDER: str = PROVIDER_OPENAI

# ============================================================================
# Embedding
# ============================================================================

DEFAULT_EMBEDDING_DIMENSION: int = 1536
MAX_EMBEDDING_DIMENSION: int = 4096

# ============================================================================
# Statistics
# ============================================================================

STAT_TOTAL_EMBEDDINGS: str = "total_embeddings"
STAT_TOTAL_PROVIDERS: str = "total_providers"
STAT_TOTAL_SOURCES: str = "total_sources"

# ============================================================================
# Metadata
# ============================================================================

METADATA_KEY_SOURCE_TYPE: str = "source_type"
METADATA_KEY_SOURCE_ID: str = "source_id"
METADATA_KEY_KNOWLEDGE_ID: str = "knowledge_id"

# ============================================================================
# API
# ============================================================================

VECTORSTORE_TAG: str = "AI Vector Store"

VECTORSTORE_PREFIX: str = "/vectorstore"

# ============================================================================
# Messages
# ============================================================================

MSG_SEARCH_COMPLETED: str = "Vector search completed successfully."
MSG_SIMILAR_COMPLETED: str = "Similar embeddings retrieved successfully."
MSG_HYBRID_COMPLETED: str = "Hybrid search completed successfully."
MSG_PROVIDER_LISTED: str = "Providers retrieved successfully."
MSG_STATISTICS_RETRIEVED: str = "Vector store statistics retrieved successfully."

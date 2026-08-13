/**
 * AI Documents domain types.
 *
 * Defines the TypeScript models used throughout the AI Documents
 * feature. Mirrors the real backend contract in
 * `app/ai/documents/schemas.py` (`Document`).
 */

/**
 * Document processing status.
 *
 * Matches `DOCUMENT_STATUSES` in `app/ai/documents/constants.py`.
 * The AI Documents module only tracks this value -- it does not
 * itself run any chunking/embedding pipeline that would advance it.
 */
export type AIDocumentStatus =
  | "registered"
  | "parsing"
  | "parsed"
  | "chunking"
  | "chunked"
  | "embedding"
  | "embedded"
  | "indexed"
  | "failed"
  | "deleted";

/**
 * AI document entity.
 */
export interface AIDocument {
  /**
   * Document identifier.
   */
  readonly id: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Parent knowledge base identifier.
   */
  readonly knowledgeId: string;

  /**
   * Stored file name.
   */
  readonly filename: string;

  /**
   * Original uploaded file name.
   */
  readonly originalFilename: string;

  /**
   * MIME type.
   */
  readonly contentType: string;

  /**
   * File size in bytes.
   */
  readonly fileSize: number;

  /**
   * Storage location of the underlying file.
   */
  readonly storagePath: string;

  /**
   * File checksum.
   */
  readonly checksum: string;

  /**
   * Document version.
   */
  readonly version: number;

  /**
   * Processing status.
   */
  readonly status: AIDocumentStatus;

  /**
   * Number of chunks produced during processing.
   */
  readonly chunkCount: number;

  /**
   * Number of embeddings produced during processing.
   */
  readonly embeddingCount: number;

  /**
   * Arbitrary metadata.
   */
  readonly metadata: Readonly<Record<string, unknown>>;

  /**
   * Registration timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Request to register a document.
 *
 * The backend registers document *metadata* -- it has no file-upload
 * endpoint or storage backend of its own (see `DocumentCreateRequest`
 * in `app/ai/documents/schemas.py`). `storagePath` must already point
 * to a real, previously stored file.
 */
export interface CreateAIDocumentRequest {
  readonly knowledgeId: string;
  readonly filename: string;
  readonly originalFilename: string;
  readonly contentType: string;
  readonly fileSize: number;
  readonly storagePath: string;
  readonly checksum: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Request to update a document.
 */
export interface UpdateAIDocumentRequest {
  readonly filename?: string;
  readonly status?: AIDocumentStatus;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Document list query.
 */
export interface AIDocumentListQuery {
  readonly page?: number;
  readonly pageSize?: number;
}

/**
 * Paginated document response.
 */
export interface AIDocumentListResponse {
  readonly documents: readonly AIDocument[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

/**
 * Document statistics.
 */
export interface AIDocumentStatistics {
  readonly totalDocuments: number;
  readonly indexedDocuments: number;
  readonly failedDocuments: number;
  readonly deletedDocuments: number;
}

/**
 * Knowledge base option used to select a document's parent knowledge
 * base when registering a new document.
 *
 * Sourced from the sibling AI Knowledge module (`GET /api/v1/knowledge`,
 * see `app/ai/knowledge/router.py`) -- an already-implemented,
 * organization-scoped endpoint, not a new integration.
 */
export interface AIKnowledgeBaseOption {
  readonly id: string;
  readonly name: string;
}

/**
 * Supported document content types.
 *
 * Matches `SUPPORTED_DOCUMENT_TYPES` in
 * `app/ai/documents/constants.py`.
 */
export const SUPPORTED_DOCUMENT_TYPES: readonly string[] = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

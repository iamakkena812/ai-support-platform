/**
 * AI Documents API.
 *
 * Talks to the real backend AI Documents endpoints
 * (`/api/v1/ai/documents/*`, see `app/ai/documents/router.py`), which
 * use a plain snake_case JSON contract (no camelCase alias generator),
 * and to the sibling AI Knowledge endpoint (`/api/v1/knowledge`) to
 * resolve the knowledge bases a document may be registered under.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  AIDocument,
  AIDocumentListQuery,
  AIDocumentListResponse,
  AIDocumentStatistics,
  AIDocumentStatus,
  AIKnowledgeBaseOption,
  CreateAIDocumentRequest,
  UpdateAIDocumentRequest,
} from "../types/aiDocument.types";

/**
 * Backend document representation (snake_case wire contract).
 */
interface BackendDocument {
  readonly id: string;
  readonly organization_id: string;
  readonly knowledge_id: string;
  readonly filename: string;
  readonly original_filename: string;
  readonly content_type: string;
  readonly file_size: number;
  readonly storage_path: string;
  readonly checksum: string;
  readonly version: number;
  readonly status: AIDocumentStatus;
  readonly chunk_count: number;
  readonly embedding_count: number;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly created_at: string;
  readonly updated_at: string;
}

interface BackendDocumentListResponse {
  readonly documents: readonly BackendDocument[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
}

interface BackendDocumentStatistics {
  readonly total_documents: number;
  readonly indexed_documents: number;
  readonly failed_documents: number;
  readonly deleted_documents: number;
}

interface BackendKnowledgeBase {
  readonly id: string;
  readonly name: string;
}

interface BackendKnowledgeListResponse {
  readonly items: readonly BackendKnowledgeBase[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}

const BASE_PATH = "/ai/documents";
const KNOWLEDGE_BASE_PATH = "/knowledge";

/**
 * Maps a backend document into the frontend document model.
 *
 * @param document - Backend document.
 * @returns Frontend AI document.
 */
function mapDocument(document: BackendDocument): AIDocument {
  return {
    id: document.id,
    organizationId: document.organization_id,
    knowledgeId: document.knowledge_id,
    filename: document.filename,
    originalFilename: document.original_filename,
    contentType: document.content_type,
    fileSize: document.file_size,
    storagePath: document.storage_path,
    checksum: document.checksum,
    version: document.version,
    status: document.status,
    chunkCount: document.chunk_count,
    embeddingCount: document.embedding_count,
    metadata: document.metadata,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

/**
 * AI Documents API client.
 */
export const aiDocumentApi = {
  /**
   * Returns a paginated list of documents in the caller's organization.
   *
   * @param query - Query parameters.
   * @returns Paginated document response.
   */
  async listDocuments(
    query?: AIDocumentListQuery,
  ): Promise<AIDocumentListResponse> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 20;

    const { data } = await apiClient.get<BackendDocumentListResponse>(
      BASE_PATH,
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

    return {
      documents: data.documents.map(mapDocument),
      total: data.total,
      page: data.page,
      pageSize: data.page_size,
    };
  },

  /**
   * Returns a single document.
   *
   * @param documentId - Document identifier.
   * @returns Document.
   */
  async getDocument(documentId: string): Promise<AIDocument> {
    const { data } = await apiClient.get<BackendDocument>(
      `${BASE_PATH}/${documentId}`,
    );

    return mapDocument(data);
  },

  /**
   * Registers a new document.
   *
   * @param request - Document creation request.
   * @returns Created document.
   */
  async createDocument(
    request: CreateAIDocumentRequest,
  ): Promise<AIDocument> {
    const { data } = await apiClient.post<BackendDocument>(BASE_PATH, {
      knowledge_id: request.knowledgeId,
      filename: request.filename,
      original_filename: request.originalFilename,
      content_type: request.contentType,
      file_size: request.fileSize,
      storage_path: request.storagePath,
      checksum: request.checksum,
      metadata: request.metadata ?? {},
    });

    return mapDocument(data);
  },

  /**
   * Updates a document.
   *
   * @param documentId - Document identifier.
   * @param request - Update request.
   * @returns Updated document.
   */
  async updateDocument(
    documentId: string,
    request: UpdateAIDocumentRequest,
  ): Promise<AIDocument> {
    const { data } = await apiClient.patch<BackendDocument>(
      `${BASE_PATH}/${documentId}`,
      {
        filename: request.filename,
        status: request.status,
        metadata: request.metadata,
      },
    );

    return mapDocument(data);
  },

  /**
   * Deletes a document.
   *
   * @param documentId - Document identifier.
   */
  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${documentId}`);
  },

  /**
   * Returns document statistics for the caller's organization.
   *
   * @returns Document statistics.
   */
  async getStatistics(): Promise<AIDocumentStatistics> {
    const { data } = await apiClient.get<BackendDocumentStatistics>(
      `${BASE_PATH}/statistics`,
    );

    return {
      totalDocuments: data.total_documents,
      indexedDocuments: data.indexed_documents,
      failedDocuments: data.failed_documents,
      deletedDocuments: data.deleted_documents,
    };
  },

  /**
   * Returns the knowledge bases available in the caller's organization,
   * used to select a document's parent knowledge base.
   *
   * @returns Knowledge base options.
   */
  async listKnowledgeBases(): Promise<readonly AIKnowledgeBaseOption[]> {
    const { data } = await apiClient.get<BackendKnowledgeListResponse>(
      KNOWLEDGE_BASE_PATH,
      {
        params: {
          offset: 0,
          limit: 100,
        },
      },
    );

    return data.items.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  },
};

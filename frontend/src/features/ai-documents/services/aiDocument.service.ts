/**
 * AI Documents service.
 *
 * Provides the service layer between the UI and the AI Documents
 * API client.
 */

import { aiDocumentApi } from "../api/aiDocument.api";

import type {
  AIDocument,
  AIDocumentListQuery,
  AIDocumentListResponse,
  AIDocumentStatistics,
  AIKnowledgeBaseOption,
  CreateAIDocumentRequest,
  UpdateAIDocumentRequest,
} from "../types/aiDocument.types";

/**
 * AI Documents service.
 */
export const aiDocumentService = {
  /**
   * Returns a paginated list of documents.
   *
   * @param query - Query parameters.
   * @returns Paginated document response.
   */
  async listDocuments(
    query?: AIDocumentListQuery,
  ): Promise<AIDocumentListResponse> {
    return aiDocumentApi.listDocuments(query);
  },

  /**
   * Returns a single document.
   *
   * @param documentId - Document identifier.
   * @returns Document.
   */
  async getDocument(documentId: string): Promise<AIDocument> {
    return aiDocumentApi.getDocument(documentId);
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
    return aiDocumentApi.createDocument(request);
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
    return aiDocumentApi.updateDocument(documentId, request);
  },

  /**
   * Deletes a document.
   *
   * @param documentId - Document identifier.
   */
  async deleteDocument(documentId: string): Promise<void> {
    return aiDocumentApi.deleteDocument(documentId);
  },

  /**
   * Returns document statistics.
   *
   * @returns Document statistics.
   */
  async getStatistics(): Promise<AIDocumentStatistics> {
    return aiDocumentApi.getStatistics();
  },

  /**
   * Returns the available knowledge base options.
   *
   * @returns Knowledge base options.
   */
  async listKnowledgeBases(): Promise<readonly AIKnowledgeBaseOption[]> {
    return aiDocumentApi.listKnowledgeBases();
  },
};

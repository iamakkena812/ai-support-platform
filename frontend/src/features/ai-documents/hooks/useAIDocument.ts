/**
 * React Query hook for retrieving a single AI document.
 */

import { useQuery } from "@tanstack/react-query";

import { aiDocumentService } from "../services/aiDocument.service";

import type { AIDocument } from "../types/aiDocument.types";

/**
 * Query key factory for AI document queries.
 */
export const aiDocumentQueryKeys = {
  /**
   * Root query key.
   */
  all: ["ai-documents"] as const,

  /**
   * Detail query key.
   *
   * @param documentId - Document identifier.
   * @returns Query key.
   */
  detail: (documentId: string) =>
    [...aiDocumentQueryKeys.all, "detail", documentId] as const,
};

/**
 * Retrieves a single AI document.
 *
 * @param documentId - Document identifier.
 * @returns React Query result.
 */
export const useAIDocument = (documentId: string) =>
  useQuery<AIDocument>({
    queryKey: aiDocumentQueryKeys.detail(documentId),

    queryFn: () => aiDocumentService.getDocument(documentId),

    enabled: documentId.trim().length > 0,
  });

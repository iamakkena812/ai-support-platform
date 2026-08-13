/**
 * React Query hook for retrieving a single AI knowledge base.
 */

import { useQuery } from "@tanstack/react-query";

import { aiKnowledgeService } from "../services/aiKnowledge.service";

import type { AIKnowledgeBase } from "../types/aiKnowledge.types";

/**
 * Query key factory for AI knowledge base queries.
 */
export const aiKnowledgeQueryKeys = {
  /**
   * Root query key.
   */
  all: ["ai-knowledge"] as const,

  /**
   * Detail query key.
   *
   * @param knowledgeId - Knowledge base identifier.
   * @returns Query key.
   */
  detail: (knowledgeId: string) =>
    [...aiKnowledgeQueryKeys.all, "detail", knowledgeId] as const,
};

/**
 * Retrieves a single AI knowledge base.
 *
 * @param knowledgeId - Knowledge base identifier.
 * @returns React Query result.
 */
export const useAIKnowledgeBase = (knowledgeId: string) =>
  useQuery<AIKnowledgeBase>({
    queryKey: aiKnowledgeQueryKeys.detail(knowledgeId),

    queryFn: () => aiKnowledgeService.getKnowledgeBase(knowledgeId),

    enabled: knowledgeId.trim().length > 0,
  });

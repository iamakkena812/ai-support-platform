/**
 * Knowledge article React Query hook.
 */

import { useQuery } from "@tanstack/react-query";

import { knowledgeBaseService } from "../services/knowledgeBase.service";

import type {
  KnowledgeArticle,
} from "../types/knowledgeBase.types";

/**
 * Returns a single knowledge article.
 *
 * @param articleId - Article identifier.
 * @returns React Query result.
 */
export function useKnowledgeArticle(
  articleId: string,
) {
  return useQuery<
    KnowledgeArticle
  >({
    queryKey: [
      "knowledge-base",
      "article",
      articleId,
    ],

    queryFn: () =>
      knowledgeBaseService.getArticle(
        articleId,
      ),

    enabled:
      articleId.length > 0,
  });
}
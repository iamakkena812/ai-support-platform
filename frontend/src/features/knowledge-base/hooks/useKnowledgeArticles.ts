/**
 * Knowledge Base React Query hooks.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { knowledgeBaseService } from "../services/knowledgeBase.service";

import type {
  CreateKnowledgeArticleRequest,
  KnowledgeArticle,
  KnowledgeArticleListQuery,
  KnowledgeArticleListResponse,
} from "../types/knowledgeBase.types";

/**
 * Query keys.
 */
const knowledgeBaseKeys = {
  /**
   * Root query key.
   */
  all: [
    "knowledge-base",
  ] as const,

  /**
   * Article list query key.
   *
   * @param query - Query values.
   * @returns Query key.
   */
  list: (
    query: KnowledgeArticleListQuery,
  ) =>
    [
      ...knowledgeBaseKeys.all,
      "list",
      query,
    ] as const,

  /**
   * Article query key.
   *
   * @param articleId - Article identifier.
   * @returns Query key.
   */
  article: (
    articleId: string,
  ) =>
    [
      ...knowledgeBaseKeys.all,
      "article",
      articleId,
    ] as const,
};

/**
 * Returns a paginated list of articles.
 *
 * @param query - Query values.
 * @returns React Query result.
 */
export function useKnowledgeArticles(
  query: KnowledgeArticleListQuery,
) {
  return useQuery<
    KnowledgeArticleListResponse
  >({
    queryKey:
      knowledgeBaseKeys.list(
        query,
      ),
    queryFn: () =>
      knowledgeBaseService.listArticles(
        query,
      ),
  });
}

/**
 * Creates a knowledge article.
 *
 * @returns Mutation.
 */
export function useCreateKnowledgeArticle() {
  const queryClient =
    useQueryClient();

  return useMutation<
    KnowledgeArticle,
    Error,
    CreateKnowledgeArticleRequest
  >({
    mutationFn: (
      request,
    ) =>
      knowledgeBaseService.createArticle(
        request,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            knowledgeBaseKeys.all,
        },
      );
    },
  });
}

/**
 * Updates a knowledge article.
 *
 * @returns Mutation.
 */
export function useUpdateKnowledgeArticle() {
  const queryClient =
    useQueryClient();

  return useMutation<
    KnowledgeArticle,
    Error,
    {
      articleId: string;
      request: CreateKnowledgeArticleRequest;
    }
  >({
    mutationFn: ({
      articleId,
      request,
    }) =>
      knowledgeBaseService.updateArticle(
        articleId,
        request,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            knowledgeBaseKeys.all,
        },
      );
    },
  });
}

/**
 * Deletes a knowledge article.
 *
 * @returns Mutation.
 */
export function useDeleteKnowledgeArticle() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (
      articleId,
    ) =>
      knowledgeBaseService.deleteArticle(
        articleId,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            knowledgeBaseKeys.all,
        },
      );
    },
  });
}
/**
 * Knowledge Base API.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateKnowledgeArticleRequest,
  KnowledgeArticle,
  KnowledgeArticleListQuery,
  KnowledgeArticleListResponse,
} from "../types/knowledgeBase.types";

/**
 * Knowledge Base API client.
 */
export const knowledgeBaseApi = {
  /**
   * Returns a paginated list of knowledge articles.
   *
   * @param query - Query parameters.
   * @returns Paginated article response.
   */
  async list(
    query: KnowledgeArticleListQuery,
  ): Promise<KnowledgeArticleListResponse> {
    const response =
      await apiClient.get<
        KnowledgeArticleListResponse
      >(
        "/knowledge-base/articles",
        {
          params: query,
        },
      );

    return response.data;
  },

  /**
   * Returns a knowledge article.
   *
   * @param articleId - Article identifier.
   * @returns Knowledge article.
   */
  async get(
    articleId: string,
  ): Promise<KnowledgeArticle> {
    const response =
      await apiClient.get<
        KnowledgeArticle
      >(
        `/knowledge-base/articles/${articleId}`,
      );

    return response.data;
  },

  /**
   * Creates a knowledge article.
   *
   * @param request - Create request.
   * @returns Created article.
   */
  async create(
    request: CreateKnowledgeArticleRequest,
  ): Promise<KnowledgeArticle> {
    const response =
      await apiClient.post<
        KnowledgeArticle
      >(
        "/knowledge-base/articles",
        request,
      );

    return response.data;
  },

  /**
   * Updates a knowledge article.
   *
   * @param articleId - Article identifier.
   * @param request - Update request.
   * @returns Updated article.
   */
  async update(
    articleId: string,
    request: CreateKnowledgeArticleRequest,
  ): Promise<KnowledgeArticle> {
    const response =
      await apiClient.put<
        KnowledgeArticle
      >(
        `/knowledge-base/articles/${articleId}`,
        request,
      );

    return response.data;
  },

  /**
   * Deletes a knowledge article.
   *
   * @param articleId - Article identifier.
   */
  async delete(
    articleId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/knowledge-base/articles/${articleId}`,
    );
  },
};
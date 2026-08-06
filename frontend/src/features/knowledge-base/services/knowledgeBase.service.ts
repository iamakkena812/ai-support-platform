/**
 * Knowledge Base service.
 */

import { knowledgeBaseApi } from "../api/knowledgeBase.api";

import type {
  CreateKnowledgeArticleRequest,
  KnowledgeArticle,
  KnowledgeArticleListQuery,
  KnowledgeArticleListResponse,
} from "../types/knowledgeBase.types";

/**
 * Knowledge Base service.
 *
 * Encapsulates business operations for
 * Knowledge Base articles.
 */
export const knowledgeBaseService = {
  /**
   * Returns a paginated list of articles.
   *
   * @param query - List query.
   * @returns Paginated article response.
   */
  listArticles(
    query: KnowledgeArticleListQuery,
  ): Promise<KnowledgeArticleListResponse> {
    return knowledgeBaseApi.list(
      query,
    );
  },

  /**
   * Returns a knowledge article.
   *
   * @param articleId - Article identifier.
   * @returns Knowledge article.
   */
  getArticle(
    articleId: string,
  ): Promise<KnowledgeArticle> {
    return knowledgeBaseApi.get(
      articleId,
    );
  },

  /**
   * Creates a knowledge article.
   *
   * @param request - Create request.
   * @returns Created article.
   */
  createArticle(
    request: CreateKnowledgeArticleRequest,
  ): Promise<KnowledgeArticle> {
    return knowledgeBaseApi.create(
      request,
    );
  },

  /**
   * Updates a knowledge article.
   *
   * @param articleId - Article identifier.
   * @param request - Update request.
   * @returns Updated article.
   */
  updateArticle(
    articleId: string,
    request: CreateKnowledgeArticleRequest,
  ): Promise<KnowledgeArticle> {
    return knowledgeBaseApi.update(
      articleId,
      request,
    );
  },

  /**
   * Deletes a knowledge article.
   *
   * @param articleId - Article identifier.
   */
  deleteArticle(
    articleId: string,
  ): Promise<void> {
    return knowledgeBaseApi.delete(
      articleId,
    );
  },
};
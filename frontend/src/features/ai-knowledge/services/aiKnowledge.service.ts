/**
 * AI Knowledge service.
 *
 * Provides the service layer between the UI and the AI Knowledge API
 * client.
 */

import { aiKnowledgeApi } from "../api/aiKnowledge.api";

import type {
  AIKnowledgeBase,
  AIKnowledgeListQuery,
  AIKnowledgeListResponse,
  CreateAIKnowledgeRequest,
  UpdateAIKnowledgeRequest,
} from "../types/aiKnowledge.types";

/**
 * AI Knowledge service.
 */
export const aiKnowledgeService = {
  /**
   * Returns a paginated list of knowledge bases.
   *
   * @param query - Query parameters.
   * @returns Paginated knowledge base response.
   */
  async listKnowledgeBases(
    query?: AIKnowledgeListQuery,
  ): Promise<AIKnowledgeListResponse> {
    return aiKnowledgeApi.listKnowledgeBases(query);
  },

  /**
   * Returns a single knowledge base.
   *
   * @param knowledgeId - Knowledge base identifier.
   * @returns Knowledge base.
   */
  async getKnowledgeBase(knowledgeId: string): Promise<AIKnowledgeBase> {
    return aiKnowledgeApi.getKnowledgeBase(knowledgeId);
  },

  /**
   * Creates a new knowledge base.
   *
   * @param request - Knowledge base creation request.
   * @returns Created knowledge base.
   */
  async createKnowledgeBase(
    request: CreateAIKnowledgeRequest,
  ): Promise<AIKnowledgeBase> {
    return aiKnowledgeApi.createKnowledgeBase(request);
  },

  /**
   * Updates a knowledge base.
   *
   * @param knowledgeId - Knowledge base identifier.
   * @param request - Update request.
   * @returns Updated knowledge base.
   */
  async updateKnowledgeBase(
    knowledgeId: string,
    request: UpdateAIKnowledgeRequest,
  ): Promise<AIKnowledgeBase> {
    return aiKnowledgeApi.updateKnowledgeBase(knowledgeId, request);
  },

  /**
   * Deletes a knowledge base.
   *
   * @param knowledgeId - Knowledge base identifier.
   */
  async deleteKnowledgeBase(knowledgeId: string): Promise<void> {
    return aiKnowledgeApi.deleteKnowledgeBase(knowledgeId);
  },
};

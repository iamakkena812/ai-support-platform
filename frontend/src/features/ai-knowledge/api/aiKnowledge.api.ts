/**
 * AI Knowledge API.
 *
 * Talks to the real backend AI Knowledge endpoints (`/api/v1/knowledge`,
 * see `app/ai/knowledge/router.py`), which use a plain snake_case JSON
 * contract (no camelCase alias generator).
 */

import { apiClient } from "../../../api/axios/client";

import type {
  AIKnowledgeBase,
  AIKnowledgeListQuery,
  AIKnowledgeListResponse,
  AIKnowledgeStatus,
  AIKnowledgeVisibility,
  CreateAIKnowledgeRequest,
  UpdateAIKnowledgeRequest,
} from "../types/aiKnowledge.types";

/**
 * Backend knowledge base representation (snake_case wire contract).
 */
interface BackendKnowledgeBase {
  readonly id: string;
  readonly organization_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: AIKnowledgeStatus;
  readonly visibility: AIKnowledgeVisibility;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly created_by: string;
  readonly updated_by: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

interface BackendKnowledgeListResponse {
  readonly items: readonly BackendKnowledgeBase[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}

const BASE_PATH = "/knowledge";

/**
 * Maps a backend knowledge base into the frontend model.
 *
 * @param knowledge - Backend knowledge base.
 * @returns Frontend AI knowledge base.
 */
function mapKnowledgeBase(knowledge: BackendKnowledgeBase): AIKnowledgeBase {
  return {
    id: knowledge.id,
    organizationId: knowledge.organization_id,
    name: knowledge.name,
    description: knowledge.description,
    status: knowledge.status,
    visibility: knowledge.visibility,
    metadata: knowledge.metadata,
    createdBy: knowledge.created_by,
    updatedBy: knowledge.updated_by,
    createdAt: knowledge.created_at,
    updatedAt: knowledge.updated_at,
  };
}

/**
 * AI Knowledge API client.
 */
export const aiKnowledgeApi = {
  /**
   * Returns a paginated list of knowledge bases visible to the caller.
   *
   * @param query - Query parameters.
   * @returns Paginated knowledge base response.
   */
  async listKnowledgeBases(
    query?: AIKnowledgeListQuery,
  ): Promise<AIKnowledgeListResponse> {
    const offset = query?.offset ?? 0;
    const limit = query?.limit ?? 20;

    const { data } = await apiClient.get<BackendKnowledgeListResponse>(
      BASE_PATH,
      {
        params: {
          offset,
          limit,
        },
      },
    );

    return {
      items: data.items.map(mapKnowledgeBase),
      total: data.total,
      offset: data.offset,
      limit: data.limit,
    };
  },

  /**
   * Returns a single knowledge base.
   *
   * @param knowledgeId - Knowledge base identifier.
   * @returns Knowledge base.
   */
  async getKnowledgeBase(knowledgeId: string): Promise<AIKnowledgeBase> {
    const { data } = await apiClient.get<BackendKnowledgeBase>(
      `${BASE_PATH}/${knowledgeId}`,
    );

    return mapKnowledgeBase(data);
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
    const { data } = await apiClient.post<BackendKnowledgeBase>(BASE_PATH, {
      name: request.name,
      description: request.description,
      visibility: request.visibility,
      metadata: request.metadata ?? {},
    });

    return mapKnowledgeBase(data);
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
    const { data } = await apiClient.patch<BackendKnowledgeBase>(
      `${BASE_PATH}/${knowledgeId}`,
      {
        name: request.name,
        description: request.description,
        status: request.status,
        visibility: request.visibility,
        metadata: request.metadata,
      },
    );

    return mapKnowledgeBase(data);
  },

  /**
   * Deletes a knowledge base.
   *
   * @param knowledgeId - Knowledge base identifier.
   */
  async deleteKnowledgeBase(knowledgeId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${knowledgeId}`);
  },
};

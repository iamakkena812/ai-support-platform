/**
 * AI Knowledge domain types.
 *
 * Defines the TypeScript models used throughout the AI Knowledge
 * feature. Mirrors the real backend contract in
 * `app/ai/knowledge/schemas.py` (`Knowledge*`). A knowledge base here
 * is a RAG container that documents (see the AI Documents feature)
 * are registered under -- it is not an article/content entity.
 */

/**
 * Knowledge base status.
 *
 * Matches `KnowledgeStatus` in `app/ai/knowledge/constants.py`.
 */
export type AIKnowledgeStatus = "active" | "archived";

/**
 * Knowledge base visibility.
 *
 * `private` -- visible and modifiable only by its creator.
 * `organization` -- readable by anyone in the organization; still only
 * modifiable by its creator.
 *
 * Matches `KnowledgeVisibility` in `app/ai/knowledge/constants.py`.
 */
export type AIKnowledgeVisibility = "private" | "organization";

/**
 * AI knowledge base entity.
 */
export interface AIKnowledgeBase {
  /**
   * Knowledge base identifier.
   */
  readonly id: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Knowledge base name.
   */
  readonly name: string;

  /**
   * Knowledge base description.
   */
  readonly description: string | null;

  /**
   * Knowledge base status.
   */
  readonly status: AIKnowledgeStatus;

  /**
   * Knowledge base visibility.
   */
  readonly visibility: AIKnowledgeVisibility;

  /**
   * Arbitrary metadata.
   */
  readonly metadata: Readonly<Record<string, unknown>>;

  /**
   * Identifier of the user who created the knowledge base.
   */
  readonly createdBy: string;

  /**
   * Identifier of the user who last updated the knowledge base.
   */
  readonly updatedBy: string | null;

  /**
   * Creation timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Request to create a knowledge base.
 */
export interface CreateAIKnowledgeRequest {
  readonly name: string;
  readonly description?: string;
  readonly visibility?: AIKnowledgeVisibility;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Request to update a knowledge base.
 */
export interface UpdateAIKnowledgeRequest {
  readonly name?: string;
  readonly description?: string;
  readonly status?: AIKnowledgeStatus;
  readonly visibility?: AIKnowledgeVisibility;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Knowledge base list query.
 */
export interface AIKnowledgeListQuery {
  readonly offset?: number;
  readonly limit?: number;
}

/**
 * Paginated knowledge base response.
 */
export interface AIKnowledgeListResponse {
  readonly items: readonly AIKnowledgeBase[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}

/**
 * Knowledge Base domain types.
 *
 * Defines the TypeScript models used throughout the
 * Knowledge Base feature.
 */

/**
 * Article status.
 */
export type KnowledgeArticleStatus =
  | "draft"
  | "published"
  | "archived";

/**
 * Knowledge category.
 */
export interface KnowledgeCategory {
  /**
   * Category identifier.
   */
  readonly id: string;

  /**
   * Category name.
   */
  readonly name: string;

  /**
   * Category description.
   */
  readonly description?: string | null;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;
}

/**
 * Knowledge article.
 */
export interface KnowledgeArticle {
  /**
   * Article identifier.
   */
  readonly id: string;

  /**
   * Article title.
   */
  readonly title: string;

  /**
   * Article slug.
   */
  readonly slug: string;

  /**
   * Article content.
   */
  readonly content: string;

  /**
   * Short summary.
   */
  readonly summary?: string | null;

  /**
   * Category.
   */
  readonly category: KnowledgeCategory;

  /**
   * Article status.
   */
  readonly status: KnowledgeArticleStatus;

  /**
   * Tags.
   */
  readonly tags: readonly string[];

  /**
   * View count.
   */
  readonly viewCount: number;

  /**
   * Author name.
   */
  readonly authorName: string;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;

  /**
   * Updated timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Create article request.
 */
export interface CreateKnowledgeArticleRequest {
  /**
   * Article title.
   */
  readonly title: string;

  /**
   * Article content.
   */
  readonly content: string;

  /**
   * Summary.
   */
  readonly summary?: string;

  /**
   * Category identifier.
   */
  readonly categoryId: string;

  /**
   * Tags.
   */
  readonly tags: readonly string[];

  /**
   * Status.
   */
  readonly status: KnowledgeArticleStatus;
}

/**
 * Knowledge Base filter state.
 */
export interface KnowledgeFilterState {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Category identifier.
   */
  readonly categoryId?: string;

  /**
   * Status.
   */
  readonly status?: KnowledgeArticleStatus;
}

/**
 * Knowledge article list query.
 */
export interface KnowledgeArticleListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;

  /**
   * Filters.
   */
  readonly filters?: KnowledgeFilterState;
}

/**
 * Paginated article response.
 */
export interface KnowledgeArticleListResponse {
  /**
   * Articles.
   */
  readonly items: readonly KnowledgeArticle[];

  /**
   * Total records.
   */
  readonly total: number;

  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Page size.
   */
  readonly pageSize: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;
}
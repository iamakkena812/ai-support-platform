/**
 * Comment domain types.
 *
 * Defines the TypeScript models used throughout the
 * Comments feature.
 */

/**
 * Comment author reference.
 */
export interface CommentAuthor {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * User display name.
   */
  readonly name: string;

  /**
   * User email.
   */
  readonly email?: string | null;

  /**
   * User avatar URL.
   */
  readonly avatarUrl?: string | null;
}

/**
 * Ticket reference.
 */
export interface TicketReference {
  /**
   * Ticket identifier.
   */
  readonly id: string;

  /**
   * Ticket number.
   */
  readonly ticketNumber: string;

  /**
   * Ticket title.
   */
  readonly title: string;
}

/**
 * Comment entity.
 */
export interface Comment {
  /**
   * Comment identifier.
   */
  readonly id: string;

  /**
   * Ticket identifier.
   */
  readonly ticketId: string;

  /**
   * Comment content.
   */
  readonly content: string;

  /**
   * Indicates whether the comment is internal.
   */
  readonly isInternal: boolean;

  /**
   * Comment author.
   */
  readonly author: CommentAuthor;

  /**
   * Associated ticket.
   */
  readonly ticket?: TicketReference | null;

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
 * Create comment request.
 */
export interface CreateCommentRequest {
  /**
   * Ticket identifier.
   */
  readonly ticketId: string;

  /**
   * Comment content.
   */
  readonly content: string;

  /**
   * Indicates whether the comment is internal.
   */
  readonly isInternal: boolean;
}

/**
 * Update comment request.
 */
export interface UpdateCommentRequest {
  /**
   * Updated content.
   */
  readonly content?: string;

  /**
   * Updated internal flag.
   */
  readonly isInternal?: boolean;
}

/**
 * Comment filter values.
 */
export interface CommentFilterValues {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Ticket identifier.
   */
  readonly ticketId?: string;

  /**
   * Author identifier.
   */
  readonly authorId?: string;

  /**
   * Internal comments only.
   */
  readonly isInternal?: boolean;
}

/**
 * Sort direction.
 */
export type SortDirection = "asc" | "desc";

/**
 * Comment sorting.
 */
export interface CommentSort {
  /**
   * Field name.
   */
  readonly field: keyof Comment;

  /**
   * Sort direction.
   */
  readonly direction: SortDirection;
}

/**
 * Comment list query.
 */
export interface CommentListQuery {
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
  readonly filters?: CommentFilterValues;

  /**
   * Sorting.
   */
  readonly sort?: CommentSort;
}

/**
 * Paginated comment response.
 */
export interface CommentListResponse {
  /**
   * Returned comments.
   */
  readonly items: readonly Comment[];

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

/**
 * Comment statistics.
 */
export interface CommentStatistics {
  /**
   * Total comments.
   */
  readonly total: number;

  /**
   * Internal comments.
   */
  readonly internal: number;

  /**
   * Public comments.
   */
  readonly public: number;
}
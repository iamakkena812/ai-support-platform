/**
 * Team domain types.
 */

/**
 * Team.
 */
export interface Team {
  /**
   * Team identifier.
   */
  readonly id: string;

  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Team description.
   */
  readonly description?: string | null;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Whether the team is active.
   */
  readonly isActive: boolean;

  /**
   * Team creation timestamp.
   */
  readonly createdAt: string;

  /**
   * Team update timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Create team request.
 */
export interface CreateTeamRequest {
  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Team description.
   */
  readonly description?: string | null;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;
}

/**
 * Update team request.
 */
export interface UpdateTeamRequest {
  /**
   * Team name.
   */
  readonly name?: string;

  /**
   * Team description.
   */
  readonly description?: string | null;

  /**
   * Team status.
   */
  readonly isActive?: boolean;
}

/**
 * Team list response.
 */
export interface TeamListResponse {
  /**
   * Team collection.
   */
  readonly items: readonly Team[];

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
  readonly size: number;
}

/**
 * Team response.
 */
export interface TeamResponse {
  /**
   * Team.
   */
  readonly team: Team;
}
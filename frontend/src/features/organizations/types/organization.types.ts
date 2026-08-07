/**
 * Organization domain types.
 *
 * Defines TypeScript models used throughout
 * the Organizations feature.
 */

/**
 * Organization entity.
 */
export interface Organization {
  /**
   * Organization identifier.
   */
  readonly id: string;

  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization description.
   */
  readonly description?: string | null;

  /**
   * Active status.
   */
  readonly isActive: boolean;

  /**
   * Member count.
   */
  readonly memberCount?: number;

  /**
   * Project count.
   */
  readonly projectCount?: number;

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
 * Create organization request.
 */
export interface CreateOrganizationRequest {
  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization description.
   */
  readonly description?: string | null;
}


/**
 * Update organization request.
 */
export interface UpdateOrganizationRequest {
  /**
   * Organization name.
   */
  readonly name?: string;

  /**
   * Organization description.
   */
  readonly description?: string | null;

  /**
   * Active status.
   */
  readonly isActive?: boolean;
}


/**
 * Organization filter values.
 */
export interface OrganizationFilterValues {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Active status.
   */
  readonly isActive?: boolean;
}


/**
 * Organization list query.
 */
export interface OrganizationListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly size?: number;

  /**
   * Filters.
   */
  readonly filters?: OrganizationFilterValues;
}


/**
 * Organization list response.
 */
export interface OrganizationListResponse {
  /**
   * Organizations.
   */
  readonly items: readonly Organization[];

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
 * Organization response.
 */
export interface OrganizationResponse {
  /**
   * Organization.
   */
  readonly organization: Organization;
}


/**
 * Organization statistics.
 */
export interface OrganizationStatistics {
  /**
   * Total organizations.
   */
  readonly total: number;

  /**
   * Active organizations.
   */
  readonly active: number;

  /**
   * Inactive organizations.
   */
  readonly inactive: number;
}
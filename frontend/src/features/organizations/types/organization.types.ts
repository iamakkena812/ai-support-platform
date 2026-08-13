/**
 * Organization domain types.
 *
 * Defines TypeScript models used throughout
 * the Organizations feature. Field names and shapes
 * mirror the backend's OrganizationResponse/OrganizationListResponse
 * (backend/app/organizations/schemas.py) exactly.
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
   * Unique organization code.
   */
  readonly code: string;

  /**
   * Contact email.
   */
  readonly email?: string | null;

  /**
   * Contact phone.
   */
  readonly phone?: string | null;

  /**
   * Website URL.
   */
  readonly website?: string | null;

  /**
   * Logo URL.
   */
  readonly logoUrl?: string | null;

  /**
   * Street address.
   */
  readonly address?: string | null;

  /**
   * City.
   */
  readonly city?: string | null;

  /**
   * State or region.
   */
  readonly state?: string | null;

  /**
   * Country.
   */
  readonly country?: string | null;

  /**
   * Postal code.
   */
  readonly postalCode?: string | null;

  /**
   * IANA timezone.
   */
  readonly timezone: string;

  /**
   * Active status.
   */
  readonly isActive: boolean;

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
  readonly name: string;
  readonly code: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly website?: string | null;
  readonly logoUrl?: string | null;
  readonly address?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly postalCode?: string | null;
  readonly timezone?: string;
}


/**
 * Update organization request.
 */
export interface UpdateOrganizationRequest {
  readonly name?: string;
  readonly code?: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly website?: string | null;
  readonly logoUrl?: string | null;
  readonly address?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly postalCode?: string | null;
  readonly timezone?: string;
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
 * Organization list response.
 *
 * Matches backend/app/organizations/schemas.py OrganizationListResponse.
 */
export interface OrganizationListResponse {
  readonly organizations: readonly Organization[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
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

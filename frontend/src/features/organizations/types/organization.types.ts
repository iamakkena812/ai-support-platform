/**
 * Organization domain types.
 */

/**
 * Organization.
 */
export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Create organization request.
 */
export interface CreateOrganizationRequest {
  readonly name: string;
  readonly description?: string | null;
}

/**
 * Update organization request.
 */
export interface UpdateOrganizationRequest {
  readonly name?: string;
  readonly description?: string | null;
  readonly isActive?: boolean;
}

/**
 * Organization list response.
 */
export interface OrganizationListResponse {
  readonly items: readonly Organization[];
  readonly total: number;
  readonly page: number;
  readonly size: number;
}

/**
 * Organization response.
 */
export interface OrganizationResponse {
  readonly organization: Organization;
}
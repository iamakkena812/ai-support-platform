/**
 * Permission domain types.
 *
 * Defines TypeScript models used throughout
 * the Permissions feature. Mirrors backend/app/permissions/schemas.py
 * exactly — permission groups and role-permission mapping are not
 * part of the backend's actual API surface (no such endpoints
 * exist), so they are intentionally not modeled here.
 */

/**
 * Permission entity.
 */
export interface Permission {
  readonly id: string;
  readonly name: string;
  readonly resource: string;
  readonly action: string;
  readonly description?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Create permission request.
 */
export interface CreatePermissionRequest {
  readonly name: string;
  readonly resource: string;
  readonly action: string;
  readonly description?: string | null;
}

/**
 * Update permission request.
 */
export interface UpdatePermissionRequest {
  readonly name?: string;
  readonly resource?: string;
  readonly action?: string;
  readonly description?: string | null;
}

/**
 * Permission filter values.
 */
export interface PermissionFilterValues {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Resource filter.
   */
  readonly resource?: string;

  /**
   * Action filter.
   */
  readonly action?: string;
}

/**
 * Permission list query.
 */
export interface PermissionListQuery {
  readonly page?: number;
  readonly pageSize?: number;
  readonly filters?: PermissionFilterValues;
}

/**
 * Paginated permission response.
 *
 * Matches backend/app/permissions/schemas.py PermissionListResponse.
 */
export interface PermissionListResponse {
  readonly items: readonly Permission[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

/**
 * Permission statistics.
 *
 * Matches backend/app/permissions/schemas.py PermissionStatistics.
 */
export interface PermissionStatistics {
  readonly total: number;
  readonly resources: number;
  readonly assigned: number;
  readonly unassigned: number;
}

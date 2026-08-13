/**
 * Role domain types.
 *
 * Defines TypeScript models used throughout
 * the Roles feature. Mirrors backend/app/roles/schemas.py exactly.
 */


/**
 * Role entity.
 */
export interface Role {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly isSystem: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}


/**
 * Create role request.
 */
export interface CreateRoleRequest {
  readonly name: string;
  readonly description?: string | null;
  readonly isSystem?: boolean;
}


/**
 * Update role request.
 */
export interface UpdateRoleRequest {
  readonly name?: string;
  readonly description?: string | null;
}


/**
 * Role filters.
 */
export interface RoleFilterValues {
  readonly search?: string;
  readonly isSystem?: boolean;
}


/**
 * Role list query.
 */
export interface RoleListQuery {
  readonly page?: number;
  readonly pageSize?: number;
  readonly filters?: RoleFilterValues;
}


/**
 * Paginated role response.
 *
 * Matches backend/app/roles/schemas.py RoleListResponse.
 */
export interface RoleListResponse {
  readonly items: readonly Role[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}


/**
 * Role statistics.
 *
 * Matches backend/app/roles/schemas.py RoleStatistics.
 */
export interface RoleStatistics {
  readonly total: number;
  readonly system: number;
  readonly custom: number;
  readonly assigned: number;
  readonly unassigned: number;
}

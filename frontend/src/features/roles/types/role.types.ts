/**
 * Role domain types.
 *
 * Defines TypeScript models used throughout
 * the Roles feature.
 */


/**
 * Role status.
 */
export type RoleStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED";



/**
 * Permission reference.
 */
export interface Permission {

/**
 * Permission identifier.
 */
  readonly id: string;


/**
 * Permission name.
 */
  readonly name: string;


/**
 * Permission description.
 */
  readonly description?: string | null;

}



/**
 * User reference.
 */
export interface RoleUser {

/**
 * User identifier.
 */
  readonly id: string;


/**
 * User name.
 */
  readonly name: string;


/**
 * User email.
 */
  readonly email: string;

}



/**
 * Role entity.
 */
export interface Role {

/**
 * Role identifier.
 */
  readonly id: string;


/**
 * Role name.
 */
  readonly name: string;


/**
 * Description.
 */
  readonly description?: string | null;


/**
 * Status.
 */
  readonly status: RoleStatus;


/**
 * System role flag.
 */
  readonly isSystem: boolean;


/**
 * Assigned permissions.
 */
  readonly permissions: readonly Permission[];


/**
 * Assigned users.
 */
  readonly users: readonly RoleUser[];


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
 * Create role request.
 */
export interface CreateRoleRequest {

/**
 * Role name.
 */
  readonly name: string;


/**
 * Description.
 */
  readonly description?: string | null;


/**
 * Permission identifiers.
 */
  readonly permissionIds?: readonly string[];

}



/**
 * Update role request.
 */
export interface UpdateRoleRequest {

/**
 * Role name.
 */
  readonly name?: string;


/**
 * Description.
 */
  readonly description?: string | null;


/**
 * Role status.
 */
  readonly status?: RoleStatus;


/**
 * Permission identifiers.
 */
  readonly permissionIds?: readonly string[];

}



/**
 * Role filters.
 */
export interface RoleFilterValues {

/**
 * Search text.
 */
  readonly search?: string;


/**
 * Status filter.
 */
  readonly status?: RoleStatus;

}



/**
 * Role list query.
 */
export interface RoleListQuery {

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
  readonly filters?: RoleFilterValues;

}



/**
 * Paginated role response.
 */
export interface RoleListResponse {

/**
 * Roles.
 */
  readonly items: readonly Role[];


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
 * Role statistics.
 */
export interface RoleStatistics {

/**
 * Total roles.
 */
  readonly total: number;


/**
 * Active roles.
 */
  readonly active: number;


/**
 * Inactive roles.
 */
  readonly inactive: number;


/**
 * Archived roles.
 */
  readonly archived: number;


/**
 * Total permissions.
 */
  readonly permissions: number;

}
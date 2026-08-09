/**
 * Permission domain types.
 *
 * Defines TypeScript models used throughout
 * the Permissions feature.
 */

import type {
  PermissionAction,
  PermissionResource,
} from "../../../shared/enums/permissions";

/**
 * Permission entity.
 *
 * Represents a permission returned by the backend.
 */
export interface Permission {
  /**
   * Permission identifier.
   */
  readonly id: string;

  /**
   * Permission display name.
   */
  readonly name: string;

  /**
   * Permission resource.
   */
  readonly resource: PermissionResource;

  /**
   * Permission action.
   */
  readonly action: PermissionAction;

  /**
   * Permission description.
   */
  readonly description?: string | null;
}

/**
 * Permission group.
 *
 * Represents a logical grouping of permissions.
 */
export interface PermissionGroup {
  /**
   * Group identifier.
   */
  readonly id: string;

  /**
   * Group name.
   */
  readonly name: string;

  /**
   * Group description.
   */
  readonly description?: string | null;

  /**
   * Permissions belonging to the group.
   */
  readonly permissions: readonly Permission[];
}

/**
 * Create permission request.
 *
 * Must remain aligned with createPermissionSchema
 * and the backend create-permission contract.
 */
export interface CreatePermissionRequest {
  /**
   * Permission name.
   */
  readonly name: string;

  /**
   * Permission description.
   */
  readonly description?: string | null;

  /**
   * Optional permission group identifier.
   */
  readonly groupId?: string | null;
}

/**
 * Update permission request.
 *
 * Must remain aligned with updatePermissionSchema
 * and the backend update-permission contract.
 */
export interface UpdatePermissionRequest {
  /**
   * Permission name.
   */
  readonly name?: string;

  /**
   * Permission description.
   */
  readonly description?: string | null;

  /**
   * Optional permission group identifier.
   */
  readonly groupId?: string | null;
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
   * Permission group identifier.
   */
  readonly groupId?: string;

  /**
   * Permission resource filter.
   */
  readonly resource?: PermissionResource;
}

/**
 * Permission list query.
 */
export interface PermissionListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;

  /**
   * Permission filters.
   */
  readonly filters?: PermissionFilterValues;
}

/**
 * Paginated permission response.
 */
export interface PermissionListResponse {
  /**
   * Permissions.
   */
  readonly items: readonly Permission[];

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
 * Permission group list response.
 */
export interface PermissionGroupListResponse {
  /**
   * Permission groups.
   */
  readonly items: readonly PermissionGroup[];

  /**
   * Total records.
   */
  readonly total: number
}

/**
 * Permission statistics.
 */
export interface PermissionStatistics {
  /**
   * Total permissions.
   */
  readonly total: number;

  /**
   * Total permission groups.
   */
  readonly groups: number;

  /**
   * Total roles using permissions.
   */
  readonly assigned: number;

  /**
   * Total unassigned permissions.
   */
  readonly unassigned: number;
}

/**
 * Role permission mapping.
 *
 * Represents permissions assigned to a role.
 */
export interface RolePermissionMapping {
  /**
   * Role identifier.
   */
  readonly roleId: string;

  /**
   * Permission identifiers assigned to the role.
   */
  readonly permissionIds: readonly string[];
}

/**
 * Update role permission mapping request.
 */
export interface UpdateRolePermissionMappingRequest {
  /**
   * Permission identifiers to assign to the role.
   */
  readonly permissionIds: readonly string[];
}
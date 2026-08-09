/**
 * Permission service.
 *
 * Coordinates permission management workflows between
 * the application and the Permission API.
 */

import {
  PermissionApi,
} from "../api/permission.api";

import type {
  CreatePermissionRequest,
  Permission,
  PermissionGroupListResponse,
  PermissionListQuery,
  PermissionListResponse,
  PermissionStatistics,
  RolePermissionMapping,
  UpdatePermissionRequest,
  UpdateRolePermissionMappingRequest,
} from "../types/permission.types";

/**
 * Permission service.
 */
export const PermissionService = {
  /**
   * Retrieves permissions.
   *
   * @param query - Permission list query.
   * @returns Paginated permissions.
   */
  async getPermissions(
    query?: PermissionListQuery,
  ): Promise<PermissionListResponse> {
    return PermissionApi.getPermissions(query);
  },

  /**
   * Retrieves a permission by identifier.
   *
   * @param id - Permission identifier.
   * @returns Permission.
   */
  async getPermission(
    id: string,
  ): Promise<Permission> {
    return PermissionApi.getPermission(id);
  },

  /**
   * Creates a permission.
   *
   * @param payload - Permission creation payload.
   * @returns Created permission.
   */
  async createPermission(
    payload: CreatePermissionRequest,
  ): Promise<Permission> {
    return PermissionApi.createPermission(payload);
  },

  /**
   * Updates a permission.
   *
   * @param id - Permission identifier.
   * @param payload - Permission update payload.
   * @returns Updated permission.
   */
  async updatePermission(
    id: string,
    payload: UpdatePermissionRequest,
  ): Promise<Permission> {
    return PermissionApi.updatePermission(id, payload);
  },

  /**
   * Deletes a permission.
   *
   * @param id - Permission identifier.
   */
  async deletePermission(
    id: string,
  ): Promise<void> {
    return PermissionApi.deletePermission(id);
  },

  /**
   * Retrieves permission groups.
   *
   * @returns Permission groups.
   */
  async getPermissionGroups(): Promise<PermissionGroupListResponse> {
    return PermissionApi.getPermissionGroups();
  },

  /**
   * Retrieves permission statistics.
   *
   * @returns Permission statistics.
   */
  async getPermissionStatistics(): Promise<PermissionStatistics> {
    return PermissionApi.getPermissionStatistics();
  },

  /**
   * Retrieves permissions assigned to a role.
   *
   * @param roleId - Role identifier.
   * @returns Role permission mapping.
   */
  async getRolePermissions(
    roleId: string,
  ): Promise<RolePermissionMapping> {
    return PermissionApi.getRolePermissions(roleId);
  },

  /**
   * Updates permissions assigned to a role.
   *
   * @param roleId - Role identifier.
   * @param payload - Permission mapping payload.
   * @returns Updated role permission mapping.
   */
  async updateRolePermissions(
    roleId: string,
    payload: UpdateRolePermissionMappingRequest,
  ): Promise<RolePermissionMapping> {
    return PermissionApi.updateRolePermissions(
      roleId,
      payload,
    );
  },
};
/**
 * Permission API endpoints.
 *
 * Provides HTTP endpoint definitions for
 * permission management and role-permission mapping.
 */

import { apiClient } from "../../../api/axios/client";

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
 * Permission API.
 */
export const PermissionApi = {
  /**
   * Retrieves permissions.
   *
   * @param query - Permission list query.
   * @returns Paginated permissions.
   */
  async getPermissions(
    query?: PermissionListQuery,
  ): Promise<PermissionListResponse> {
    const response =
      await apiClient.get<PermissionListResponse>(
        "/permissions",
        {
          params: query,
        },
      );

    return response.data;
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
    const response =
      await apiClient.get<Permission>(
        `/permissions/${id}`,
      );

    return response.data;
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
    const response =
      await apiClient.post<Permission>(
        "/permissions",
        payload,
      );

    return response.data;
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
    const response =
      await apiClient.patch<Permission>(
        `/permissions/${id}`,
        payload,
      );

    return response.data;
  },

  /**
   * Deletes a permission.
   *
   * @param id - Permission identifier.
   */
  async deletePermission(
    id: string,
  ): Promise<void> {
    await apiClient.delete(
      `/permissions/${id}`,
    );
  },

  /**
   * Retrieves permission groups.
   *
   * @returns Permission groups.
   */
  async getPermissionGroups(): Promise<PermissionGroupListResponse> {
    const response =
      await apiClient.get<PermissionGroupListResponse>(
        "/permissions/groups",
      );

    return response.data;
  },

  /**
   * Retrieves permission statistics.
   *
   * @returns Permission statistics.
   */
  async getPermissionStatistics(): Promise<PermissionStatistics> {
    const response =
      await apiClient.get<PermissionStatistics>(
        "/permissions/statistics",
      );

    return response.data;
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
    const response =
      await apiClient.get<RolePermissionMapping>(
        `/roles/${roleId}/permissions`,
      );

    return response.data;
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
    const response =
      await apiClient.put<RolePermissionMapping>(
        `/roles/${roleId}/permissions`,
        payload,
      );

    return response.data;
  },
};
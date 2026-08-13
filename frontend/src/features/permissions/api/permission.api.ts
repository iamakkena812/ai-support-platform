/**
 * Permission API endpoints.
 *
 * Provides HTTP endpoint definitions for
 * permission management. Permission groups and role-permission
 * mapping endpoints (/permissions/groups, /roles/{id}/permissions)
 * do not exist on the backend and are intentionally not called
 * here — calling them would always 404.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreatePermissionRequest,
  Permission,
  PermissionListQuery,
  PermissionListResponse,
  PermissionStatistics,
  UpdatePermissionRequest,
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
          params: {
            page: query?.page,
            pageSize: query?.pageSize,
            search: query?.filters?.search,
            resource: query?.filters?.resource,
            action: query?.filters?.action,
          },
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
};

/**
 * Role API endpoints.
 *
 * Provides HTTP endpoint definitions
 * for role operations.
 */

import {
  apiClient,
} from "../../../api/axios/client";

import type {
  CreateRoleRequest,
  Role,
  RoleListQuery,
  RoleListResponse,
  RoleStatistics,
  UpdateRoleRequest,
} from "../types/role.types";



/**
 * Role API.
 */
export const RoleApi = {


  /**
   * Retrieves roles.
   *
   * @param query Role list query.
   * @returns Paginated roles.
   */
  async getRoles(
    query?: RoleListQuery,
  ): Promise<RoleListResponse> {

    const response =
      await apiClient.get<RoleListResponse>(
        "/roles",
        {
          params: {
            page: query?.page,
            pageSize: query?.pageSize,
            search: query?.filters?.search,
            isSystem: query?.filters?.isSystem,
          },
        },
      );


    return response.data;

  },



  /**
   * Retrieves role by identifier.
   *
   * @param id Role identifier.
   * @returns Role.
   */
  async getRole(
    id: string,
  ): Promise<Role> {

    const response =
      await apiClient.get<Role>(
        `/roles/${id}`,
      );


    return response.data;

  },



  /**
   * Creates role.
   *
   * @param payload Role creation payload.
   * @returns Created role.
   */
  async createRole(
    payload: CreateRoleRequest,
  ): Promise<Role> {

    const response =
      await apiClient.post<Role>(
        "/roles",
        payload,
      );


    return response.data;

  },



  /**
   * Updates role.
   *
   * @param id Role identifier.
   * @param payload Update payload.
   * @returns Updated role.
   */
  async updateRole(
    id: string,
    payload: UpdateRoleRequest,
  ): Promise<Role> {

    const response =
      await apiClient.patch<Role>(
        `/roles/${id}`,
        payload,
      );


    return response.data;

  },



  /**
   * Deletes role.
   *
   * @param id Role identifier.
   */
  async deleteRole(
    id: string,
  ): Promise<void> {

    await apiClient.delete(
      `/roles/${id}`,
    );

  },



  /**
   * Retrieves role statistics.
   *
   * @returns Role statistics.
   */
  async getRoleStatistics(): Promise<RoleStatistics> {

    const response =
      await apiClient.get<RoleStatistics>(
        "/roles/statistics",
      );


    return response.data;

  },


};

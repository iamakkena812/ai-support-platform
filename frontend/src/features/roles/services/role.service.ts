/**
 * Role service layer.
 *
 * Provides business operations
 * between UI and API layers.
 */

import {
  RoleApi,
} from "../api/role.api";

import type {
  CreateRoleRequest,
  Role,
  RoleListQuery,
  RoleListResponse,
  RoleStatistics,
  UpdateRoleRequest,
} from "../types/role.types";



/**
 * Role service.
 */
export const RoleService = {


  /**
   * Retrieves roles.
   *
   * @param query Role query.
   * @returns Paginated roles.
   */
  async getRoles(
    query?: RoleListQuery,
  ): Promise<RoleListResponse> {

    return RoleApi.getRoles(
      query,
    );

  },



  /**
   * Retrieves role.
   *
   * @param id Role identifier.
   * @returns Role.
   */
  async getRole(
    id: string,
  ): Promise<Role> {

    return RoleApi.getRole(
      id,
    );

  },



  /**
   * Creates role.
   *
   * @param payload Role payload.
   * @returns Created role.
   */
  async createRole(
    payload: CreateRoleRequest,
  ): Promise<Role> {

    return RoleApi.createRole(
      payload,
    );

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

    return RoleApi.updateRole(
      id,
      payload,
    );

  },



  /**
   * Deletes role.
   *
   * @param id Role identifier.
   */
  async deleteRole(
    id: string,
  ): Promise<void> {

    return RoleApi.deleteRole(
      id,
    );

  },



  /**
   * Retrieves role statistics.
   *
   * @returns Role statistics.
   */
  async getRoleStatistics(): Promise<RoleStatistics> {

    return RoleApi.getRoleStatistics();

  },


};
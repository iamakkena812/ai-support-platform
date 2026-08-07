/**
 * User service.
 *
 * Provides the service layer between the UI and
 * the user API client.
 */

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  getUserStatistics,
  updateUser,
} from "../api/user.api";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListQuery,
  UserListResponse,
  UserStatistics,
} from "../types/user.types";


/**
 * User service.
 */
export const userService = {

  /**
   * Retrieves paginated users.
   *
   * @param query - User query parameters.
   * @returns Paginated users.
   */
  async getUsers(
    query?: UserListQuery,
  ): Promise<UserListResponse> {
    return getUsers(
      query,
    );
  },


  /**
   * Retrieves user by identifier.
   *
   * @param userId - User identifier.
   * @returns User.
   */
  async getUser(
    userId: string,
  ): Promise<User> {
    return getUser(
      userId,
    );
  },


  /**
   * Creates a user.
   *
   * @param payload - User creation payload.
   * @returns Created user.
   */
  async createUser(
    payload: CreateUserRequest,
  ): Promise<User> {
    return createUser(
      payload,
    );
  },


  /**
   * Updates a user.
   *
   * @param userId - User identifier.
   * @param payload - Update payload.
   * @returns Updated user.
   */
  async updateUser(
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<User> {
    return updateUser(
      userId,
      payload,
    );
  },


  /**
   * Deletes a user.
   *
   * @param userId - User identifier.
   */
  async deleteUser(
    userId: string,
  ): Promise<void> {
    return deleteUser(
      userId,
    );
  },


  /**
   * Retrieves user statistics.
   *
   * @returns User statistics.
   */
  async getUserStatistics(): Promise<UserStatistics> {
    return getUserStatistics();
  },
};
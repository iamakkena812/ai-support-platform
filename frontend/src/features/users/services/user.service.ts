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
  updateUser,
} from "../api/user.api";

import {
  userListResponseSchema,
  UserSchema,
} from "../schemas/user.schema";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListQuery,
  UserListResponse,
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
    const response = await getUsers(
      query,
    );

    return userListResponseSchema.parse(
      response,
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
    const response = await getUser(
      userId,
    );

    return UserSchema.parse(
      response,
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
    const response = await createUser(
      payload,
    );

    return UserSchema.parse(
      response,
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
    const response = await updateUser(
      userId,
      payload,
    );

    return UserSchema.parse(
      response,
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
};

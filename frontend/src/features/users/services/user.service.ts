/**
 * User service.
 *
 * Contains business logic for user operations.
 */

import { UserApi } from "../api/user.api";

import {
  userListResponseSchema,
  userResponseSchema,
} from "../schemas/user.schema";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserResponse,
} from "../types/user.types";

/**
 * User service.
 */
export class UserService {
  /**
   * List users.
   */
  public static async getUsers(
    page = 1,
    size = 10,
  ): Promise<UserListResponse> {
    const response = await UserApi.getUsers(
      page,
      size,
    );

    return userListResponseSchema.parse(
      response,
    ) as UserListResponse;
  }

  /**
   * Get user.
   */
  public static async getUser(
    userId: string,
  ): Promise<UserResponse> {
    const response = await UserApi.getUser(
      userId,
    );

    return userResponseSchema.parse(
      response,
    ) as UserResponse;
  }

  /**
   * Create user.
   */
  public static async createUser(
    payload: CreateUserRequest,
  ): Promise<UserResponse> {
    const response = await UserApi.createUser(
      payload,
    );

    return userResponseSchema.parse(
      response,
    ) as UserResponse;
  }

  /**
   * Update user.
   */
  public static async updateUser(
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<UserResponse> {
    const response = await UserApi.updateUser(
      userId,
      payload,
    );

    return userResponseSchema.parse(
      response,
    ) as UserResponse;
  }

  /**
   * Delete user.
   */
  public static async deleteUser(
    userId: string,
  ): Promise<void> {
    await UserApi.deleteUser(userId);
  }
}
/**
 * User API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserResponse,
} from "../types/user.types";

/**
 * User API.
 */
export class UserApi {
  /**
   * List users.
   */
  public static async getUsers(
    page = 1,
    size = 10,
  ): Promise<UserListResponse> {
    const response =
      await apiClient.get<UserListResponse>(
        "/users",
        {
          params: {
            page,
            size,
          },
        },
      );

    return response.data;
  }

  /**
   * Get user by identifier.
   */
  public static async getUser(
    userId: string,
  ): Promise<UserResponse> {
    const response =
      await apiClient.get<UserResponse>(
        `/users/${userId}`,
      );

    return response.data;
  }

  /**
   * Create user.
   */
  public static async createUser(
    payload: CreateUserRequest,
  ): Promise<UserResponse> {
    const response =
      await apiClient.post<UserResponse>(
        "/users",
        payload,
      );

    return response.data;
  }

  /**
   * Update user.
   */
  public static async updateUser(
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<UserResponse> {
    const response =
      await apiClient.put<UserResponse>(
        `/users/${userId}`,
        payload,
      );

    return response.data;
  }

  /**
   * Delete user.
   */
  public static async deleteUser(
    userId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/users/${userId}`,
    );
  }
}
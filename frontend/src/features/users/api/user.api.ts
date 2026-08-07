/**
 * User API client.
 *
 * Provides low-level HTTP operations for user resources.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListQuery,
  UserListResponse,
  UserStatistics,
} from "../types/user.types";


/**
 * Users API endpoint.
 */
const BASE_PATH = "/users";


/**
 * Retrieves paginated users.
 *
 * @param query - User query parameters.
 * @returns Paginated user response.
 */
export const getUsers =
  async (
    query?: UserListQuery,
  ): Promise<UserListResponse> => {
    const {
      data,
    } =
      await apiClient.get(
        BASE_PATH,
        {
          params: query,
        },
      );

    return data;
  };


/**
 * Retrieves a user by identifier.
 *
 * @param userId - User identifier.
 * @returns User.
 */
export const getUser =
  async (
    userId: string,
  ): Promise<User> => {
    const {
      data,
    } =
      await apiClient.get(
        `${BASE_PATH}/${userId}`,
      );

    return data;
  };


/**
 * Creates a user.
 *
 * @param payload - User creation payload.
 * @returns Created user.
 */
export const createUser =
  async (
    payload: CreateUserRequest,
  ): Promise<User> => {
    const {
      data,
    } =
      await apiClient.post(
        BASE_PATH,
        payload,
      );

    return data;
  };


/**
 * Updates a user.
 *
 * @param userId - User identifier.
 * @param payload - Update payload.
 * @returns Updated user.
 */
export const updateUser =
  async (
    userId: string,
    payload: UpdateUserRequest,
  ): Promise<User> => {
    const {
      data,
    } =
      await apiClient.put(
        `${BASE_PATH}/${userId}`,
        payload,
      );

    return data;
  };


/**
 * Deletes a user.
 *
 * @param userId - User identifier.
 */
export const deleteUser =
  async (
    userId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${BASE_PATH}/${userId}`,
    );
  };


/**
 * Retrieves user statistics.
 *
 * @returns User statistics.
 */
export const getUserStatistics =
  async (): Promise<UserStatistics> => {
    const {
      data,
    } =
      await apiClient.get(
        `${BASE_PATH}/statistics`,
      );

    return data;
  };
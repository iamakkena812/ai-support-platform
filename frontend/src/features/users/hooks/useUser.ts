/**
 * React Query hooks for single user operations.
 *
 * Provides hooks for retrieving, updating,
 * and deleting a user by identifier.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  userService,
} from "../services/user.service";

import type {
  User,
  UpdateUserRequest,
} from "../types/user.types";


/**
 * Update user variables.
 */
export interface UpdateUserVariables {

  /**
   * User identifier.
   */
  readonly id: string;


  /**
   * Update payload.
   */
  readonly payload: UpdateUserRequest;
}


/**
 * User delete variables.
 */
export type DeleteUserVariables = string;


/**
 * User query keys.
 */
export const userQueryKeys = {

  /**
   * Base user key.
   */
  all: [
    "users",
  ] as const,


  /**
   * User detail key.
   *
   * @param id User identifier.
   */
  detail: (
    id: string,
  ) =>
    [
      "users",
      "detail",
      id,
    ] as const,


  /**
   * User statistics key.
   */
  statistics: () =>
    [
      "users",
      "statistics",
    ] as const,
};


/**
 * Retrieves a user by identifier.
 *
 * @param id User identifier.
 * @returns User query.
 */
export function useUser(
  id: string,
) {

  return useQuery<User>({
    queryKey:
      userQueryKeys.detail(
        id,
      ),

    queryFn:
      () =>
        userService.getUser(
          id,
        ),

    enabled:
      Boolean(id),
  });
}


/**
 * Updates an existing user.
 *
 * @returns Update mutation.
 */
export function useUpdateUser() {

  const queryClient =
    useQueryClient();


  return useMutation<
    User,
    Error,
    UpdateUserVariables
  >({

    mutationFn:
      async (
        {
          id,
          payload,
        },
      ) => {

        return userService.updateUser(
          id,
          payload,
        );
      },


    onSuccess:
      async (
        _data,
        variables,
      ) => {

        await Promise.all([
          queryClient.invalidateQueries(
            {
              queryKey:
                userQueryKeys.all,
            },
          ),

          queryClient.invalidateQueries(
            {
              queryKey:
                userQueryKeys.detail(
                  variables.id,
                ),
            },
          ),
        ]);
      },
  });
}


/**
 * Deletes a user.
 *
 * @returns Delete mutation.
 */
export function useDeleteUser() {

  const queryClient =
    useQueryClient();


  return useMutation<
    void,
    Error,
    DeleteUserVariables
  >({

    mutationFn:
      async (
        id,
      ) => {

        await userService.deleteUser(
          id,
        );
      },


    onSuccess:
      async (
        _data,
        id,
      ) => {

        await Promise.all([
          queryClient.invalidateQueries(
            {
              queryKey:
                userQueryKeys.all,
            },
          ),

          queryClient.removeQueries(
            {
              queryKey:
                userQueryKeys.detail(
                  id,
                ),
            },
          ),
        ]);
      },
  });
}
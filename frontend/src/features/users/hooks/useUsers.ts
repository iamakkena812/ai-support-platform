/**
 * React Query hooks for user collection operations.
 *
 * Provides hooks for listing, creating,
 * deleting users, and retrieving statistics.
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
  CreateUserRequest,
  User,
  UserListQuery,
  UserListResponse,
} from "../types/user.types";


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
   * User list key.
   *
   * @param query User query.
   */
  list: (
    query?: UserListQuery,
  ) =>
    [
      "users",
      "list",
      query,
    ] as const,
};


/**
 * Retrieves users.
 *
 * @param query User query.
 * @returns User list query.
 */
export function useUsers(
  query?: UserListQuery,
) {

  return useQuery<UserListResponse>({
    queryKey:
      userQueryKeys.list(
        query,
      ),

    queryFn:
      () =>
        userService.getUsers(
          query,
        ),

    staleTime:
      5 * 60 * 1000,

    gcTime:
      10 * 60 * 1000,

    retry:
      2,

    refetchOnWindowFocus:
      false,
  });
}


/**
 * Creates a user.
 *
 * @returns User creation mutation.
 */
export function useCreateUser() {

  const queryClient =
    useQueryClient();


  return useMutation<
    User,
    Error,
    CreateUserRequest
  >({

    mutationFn:
      async (
        payload,
      ) => {

        return userService.createUser(
          payload,
        );
      },


    onSuccess:
      async () => {

        await queryClient.invalidateQueries(
          {
            queryKey:
              userQueryKeys.all,
          },
        );
      },
  });
}


/**
 * Deletes a user.
 *
 * @returns User delete mutation.
 */
export function useDeleteUser() {

  const queryClient =
    useQueryClient();


  return useMutation<
    void,
    Error,
    string
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
      async () => {

        await queryClient.invalidateQueries(
          {
            queryKey:
              userQueryKeys.all,
          },
        );
      },
  });
}
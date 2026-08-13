/**
 * React Query hooks for user collection operations.
 *
 * Provides hooks for listing and creating users. Single-entity
 * hooks (detail/update/delete) live in useUser.ts to avoid two
 * competing definitions.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  userQueryKeys,
} from "./useUser";

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
 * User list query keys.
 */
export const userListQueryKeys = {
  all: userQueryKeys.all,

  list: (
    query?: UserListQuery,
  ) =>
    [
      ...userQueryKeys.all,
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
      userListQueryKeys.list(
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

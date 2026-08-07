/**
 * React Query hooks for role collection operations.
 *
 * Provides hooks for retrieving,
 * creating, and managing roles.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  RoleService,
} from "../services/role.service";

import type {
  CreateRoleRequest,
  Role,
  RoleListQuery,
} from "../types/role.types";


/**
 * Role query keys type.
 */
interface RoleQueryKeys {

  readonly all: readonly [
    "roles",
  ];


  readonly lists: () => readonly unknown[];


  readonly list: (
    query?: RoleListQuery,
  ) => readonly unknown[];


  readonly detail: (
    id: string,
  ) => readonly unknown[];


  readonly statistics: readonly [
    "roles",
    "statistics",
  ];

}



/**
 * Role query keys.
 */
export const roleQueryKeys: RoleQueryKeys =
{

  all: [
    "roles",
  ],


  lists: () =>
    [
      "roles",
      "list",
    ],


  list: (
    query?: RoleListQuery,
  ) =>
    [
      "roles",
      "list",
      query,
    ],


  detail: (
    id: string,
  ) =>
    [
      "roles",
      "detail",
      id,
    ],


  statistics: [
    "roles",
    "statistics",
  ],

};



/**
 * Retrieves roles.
 *
 * @param query Role list query.
 * @returns Role list query.
 */
export function useRoles(
  query?: RoleListQuery,
) {

  return useQuery({

    queryKey:
      roleQueryKeys.list(
        query,
      ),


    queryFn:
      () =>
        RoleService.getRoles(
          query,
        ),

  });

}



/**
 * Creates a role.
 *
 * @returns Role mutation.
 */
export function useCreateRole() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Role,
    Error,
    CreateRoleRequest
  >({

    mutationFn:
      (
        payload,
      ) =>
        RoleService.createRole(
          payload,
        ),


    onSuccess:
      async () => {

        await queryClient.invalidateQueries(
          {
            queryKey:
              roleQueryKeys.all,
          },
        );

      },

  });

}



/**
 * Retrieves role statistics.
 *
 * @returns Role statistics query.
 */
export function useRoleStatistics() {

  return useQuery({

    queryKey:
      roleQueryKeys.statistics,


    queryFn:
      () =>
        RoleService.getRoleStatistics(),

  });

}
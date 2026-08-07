/**
 * React Query hooks for single role operations.
 *
 * Provides hooks for retrieving,
 * updating, deleting roles and statistics.
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
  Role,
  UpdateRoleRequest,
} from "../types/role.types";

import {
  roleQueryKeys,
} from "./useRoles";



/**
 * Update role variables.
 */
export interface UpdateRoleVariables {


  /**
   * Role identifier.
   */
  readonly id: string;



  /**
   * Update payload.
   */
  readonly payload: UpdateRoleRequest;

}



/**
 * Retrieves role by identifier.
 *
 * @param id Role identifier.
 * @returns Role query result.
 */
export function useRole(
  id: string,
) {

  return useQuery({

    queryKey:
      roleQueryKeys.detail(
        id,
      ),


    queryFn:
      () =>
        RoleService.getRole(
          id,
        ),


    enabled:
      Boolean(id),

  });

}



/**
 * Updates existing role.
 *
 * @returns Role mutation.
 */
export function useUpdateRole() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Role,
    Error,
    UpdateRoleVariables
  >({

    mutationFn:
      async (
        {
          id,
          payload,
        },
      ) =>
        RoleService.updateRole(
          id,
          payload,
        ),


    onSuccess:
      async (
        _data,
        variables,
      ) => {


        await Promise.all([

          queryClient.invalidateQueries(
            {
              queryKey:
                roleQueryKeys.all,
            },
          ),


          queryClient.invalidateQueries(
            {
              queryKey:
                roleQueryKeys.detail(
                  variables.id,
                ),
            },
          ),

        ]);

      },

  });

}



/**
 * Deletes role.
 *
 * @returns Role delete mutation.
 */
export function useDeleteRole() {

  const queryClient =
    useQueryClient();


  return useMutation<
    void,
    Error,
    string
  >({

    mutationFn:
      (
        id,
      ) =>
        RoleService.deleteRole(
          id,
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
 * @returns Statistics query.
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
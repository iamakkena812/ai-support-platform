/**
 * Role permission hooks.
 *
 * Provides TanStack Query integration for retrieving
 * and updating permissions assigned to a role.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { PermissionService } from "../services/permission.service";

import {
  permissionQueryKeys,
} from "./usePermissions";

import type {
  UpdateRolePermissionMappingRequest,
} from "../types/permission.types";

/**
 * Retrieves permissions assigned to a role.
 *
 * @param roleId - Role identifier.
 * @returns TanStack Query result containing the role
 * permission mapping.
 */
export function useRolePermissions(
  roleId: string,
) {
  return useQuery({
    queryKey:
      permissionQueryKeys.rolePermissions(
        roleId,
      ),

    queryFn: () =>
      PermissionService.getRolePermissions(
        roleId,
      ),

    enabled: roleId.length > 0,
  });
}

/**
 * Updates permissions assigned to a role.
 *
 * Invalidates the role permission mapping and
 * related role queries after a successful update.
 *
 * @returns TanStack Query mutation.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      payload,
    }: {
      readonly roleId: string;
      readonly payload:
        UpdateRolePermissionMappingRequest;
    }) =>
      PermissionService.updateRolePermissions(
        roleId,
        payload,
      ),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey:
          permissionQueryKeys.rolePermissions(
            variables.roleId,
          ),
      });

      void queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      void queryClient.invalidateQueries({
        queryKey:
          permissionQueryKeys.lists(),
      });
    },
  });
}
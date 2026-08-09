/**
 * Permissions query hook.
 *
 * Provides TanStack Query integration for retrieving
 * and managing permissions.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  PermissionService,
} from "../services/permission.service";

import type {
  CreatePermissionRequest,
  PermissionListQuery,
  UpdatePermissionRequest,
} from "../types/permission.types";

/**
 * Query key factory for permissions.
 */
export const permissionQueryKeys = {
  all: ["permissions"] as const,

  lists: () =>
    [...permissionQueryKeys.all, "list"] as const,

  list: (query?: PermissionListQuery) =>
    [...permissionQueryKeys.lists(), query] as const,

  details: () =>
    [...permissionQueryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...permissionQueryKeys.details(), id] as const,

  groups: () =>
    [...permissionQueryKeys.all, "groups"] as const,

  statistics: () =>
    [...permissionQueryKeys.all, "statistics"] as const,

  rolePermissions: (roleId: string) =>
    [...permissionQueryKeys.all, "role", roleId] as const,
};

/**
 * Retrieves a paginated list of permissions.
 *
 * @param query - Permission list query.
 * @returns Permission query result.
 */
export function usePermissions(
  query?: PermissionListQuery,
) {
  return useQuery({
    queryKey: permissionQueryKeys.list(query),
    queryFn: () =>
      PermissionService.getPermissions(query),
  });
}

/**
 * Retrieves a permission by identifier.
 *
 * @param id - Permission identifier.
 * @returns Permission query result.
 */
export function usePermission(
  id: string,
) {
  return useQuery({
    queryKey: permissionQueryKeys.detail(id),
    queryFn: () =>
      PermissionService.getPermission(id),
    enabled: id.length > 0,
  });
}

/**
 * Creates a permission.
 *
 * @returns Permission creation mutation.
 */
export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreatePermissionRequest,
    ) => PermissionService.createPermission(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.groups(),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.statistics(),
      });
    },
  });
}

/**
 * Updates a permission.
 *
 * @returns Permission update mutation.
 */
export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      readonly id: string;
      readonly payload: UpdatePermissionRequest;
    }) =>
      PermissionService.updatePermission(
        id,
        payload,
      ),

    onSuccess: (permission) => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.detail(
          permission.id,
        ),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.groups(),
      });
    },
  });
}

/**
 * Deletes a permission.
 *
 * @returns Permission deletion mutation.
 */
export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => PermissionService.deletePermission(id),

    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: permissionQueryKeys.detail(id),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.statistics(),
      });
    },
  });
}

/**
 * Retrieves permission groups.
 *
 * @returns Permission groups query result.
 */
export function usePermissionGroups() {
  return useQuery({
    queryKey: permissionQueryKeys.groups(),
    queryFn: () =>
      PermissionService.getPermissionGroups(),
  });
}

/**
 * Retrieves permission statistics.
 *
 * @returns Permission statistics query result.
 */
export function usePermissionStatistics() {
  return useQuery({
    queryKey: permissionQueryKeys.statistics(),
    queryFn: () =>
      PermissionService.getPermissionStatistics(),
  });
}

/**
 * Retrieves permissions assigned to a role.
 *
 * @param roleId - Role identifier.
 * @returns Role permission query result.
 */
export function useRolePermissions(
  roleId: string,
) {
  return useQuery({
    queryKey: permissionQueryKeys.rolePermissions(
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
 * @returns Role permission update mutation.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      payload,
    }: {
      readonly roleId: string;
      readonly payload: {
        readonly permissionIds: readonly string[];
      };
    }) =>
      PermissionService.updateRolePermissions(
        roleId,
        payload,
      ),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.rolePermissions(
          variables.roleId,
        ),
      });

      void queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
}
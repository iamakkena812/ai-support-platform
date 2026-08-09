/**
 * Permissions query hooks.
 *
 * Provides TanStack Query integration for retrieving,
 * creating, updating, and deleting permissions.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { PermissionService } from "../services/permission.service";

import type {
  CreatePermissionRequest,
  PermissionListQuery,
  UpdatePermissionRequest,
  UpdateRolePermissionMappingRequest,
} from "../types/permission.types";

/**
 * Query key factory for the Permissions feature.
 */
export const permissionQueryKeys = {
  /**
   * Root permissions query key.
   */
  all: ["permissions"] as const,

  /**
   * Permission list query keys.
   */
  lists: () =>
    [...permissionQueryKeys.all, "list"] as const,

  /**
   * Specific permission list query key.
   *
   * @param query - Permission list query.
   */
  list: (query?: PermissionListQuery) =>
    [
      ...permissionQueryKeys.lists(),
      query,
    ] as const,

  /**
   * Permission detail query keys.
   */
  details: () =>
    [...permissionQueryKeys.all, "detail"] as const,

  /**
   * Specific permission detail query key.
   *
   * @param id - Permission identifier.
   */
  detail: (id: string) =>
    [
      ...permissionQueryKeys.details(),
      id,
    ] as const,

  /**
   * Permission group query key.
   */
  groups: () =>
    [...permissionQueryKeys.all, "groups"] as const,

  /**
   * Permission statistics query key.
   */
  statistics: () =>
    [
      ...permissionQueryKeys.all,
      "statistics",
    ] as const,

  /**
   * Role permission query key.
   *
   * @param roleId - Role identifier.
   */
  rolePermissions: (roleId: string) =>
    [
      ...permissionQueryKeys.all,
      "role",
      roleId,
    ] as const,
};

/**
 * Retrieves a paginated list of permissions.
 *
 * @param query - Optional permission list query.
 * @returns TanStack Query result.
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
 * @returns TanStack Query result.
 */
export function usePermission(id: string) {
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
 * Invalidates permission lists, groups, and statistics
 * after successful creation.
 *
 * @returns Permission creation mutation.
 */
export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreatePermissionRequest,
    ) =>
      PermissionService.createPermission(
        payload,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.groups(),
      });

      void queryClient.invalidateQueries({
        queryKey:
          permissionQueryKeys.statistics(),
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

      void queryClient.invalidateQueries({
        queryKey:
          permissionQueryKeys.statistics(),
      });
    },
  });
}

/**
 * Deletes a permission.
 *
 * Removes the deleted permission detail from
 * the query cache and invalidates dependent data.
 *
 * @returns Permission deletion mutation.
 */
export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      PermissionService.deletePermission(id),

    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey:
          permissionQueryKeys.detail(id),
      });

      void queryClient.invalidateQueries({
        queryKey:
          permissionQueryKeys.statistics(),
      });

      void queryClient.invalidateQueries({
        queryKey: permissionQueryKeys.groups(),
      });
    },
  });
}

/**
 * Retrieves permission groups.
 *
 * @returns TanStack Query result.
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
 * @returns TanStack Query result.
 */
export function usePermissionStatistics() {
  return useQuery({
    queryKey:
      permissionQueryKeys.statistics(),
    queryFn: () =>
      PermissionService.getPermissionStatistics(),
  });
}

/**
 * Retrieves permissions assigned to a role.
 *
 * @param roleId - Role identifier.
 * @returns TanStack Query result.
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
 * Invalidates the role permission mapping after
 * a successful update.
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
    },
  });
}
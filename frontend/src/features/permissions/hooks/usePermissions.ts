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
} from "../types/permission.types";

/**
 * Query key factory for the Permissions feature.
 */
export const permissionQueryKeys = {
  all: ["permissions"] as const,

  lists: () =>
    [...permissionQueryKeys.all, "list"] as const,

  list: (query?: PermissionListQuery) =>
    [
      ...permissionQueryKeys.lists(),
      query,
    ] as const,

  details: () =>
    [...permissionQueryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...permissionQueryKeys.details(),
      id,
    ] as const,

  statistics: () =>
    [
      ...permissionQueryKeys.all,
      "statistics",
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
    },
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

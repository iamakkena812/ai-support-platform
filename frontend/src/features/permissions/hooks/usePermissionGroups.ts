/**
 * Permission group hooks.
 *
 * Provides TanStack Query integration for retrieving
 * permission groups.
 */

import { useQuery } from "@tanstack/react-query";

import { PermissionService } from "../services/permission.service";

import {
  permissionQueryKeys,
} from "./usePermissions";

/**
 * Retrieves all permission groups.
 *
 * Permission groups are cached independently from
 * the paginated permission list because they are used
 * by filters, permission forms, and the role-permission
 * matrix.
 *
 * @returns TanStack Query result containing permission groups.
 */
export function usePermissionGroups() {
  return useQuery({
    queryKey: permissionQueryKeys.groups(),

    queryFn: () =>
      PermissionService.getPermissionGroups(),
  });
}
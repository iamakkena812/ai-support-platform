/**
 * Organizations hook.
 *
 * React Query hook for organization list.
 */

import { useQuery } from "@tanstack/react-query";

import { OrganizationService } from "../services/organization.service";

import type {
  OrganizationListResponse,
} from "../types/organization.types";

/**
 * Organization query keys.
 */
export const organizationQueryKeys = {
  all: ["organizations"] as const,

  lists: () =>
    [...organizationQueryKeys.all, "list"] as const,

  list: (
    page: number,
    size: number,
  ) =>
    [
      ...organizationQueryKeys.lists(),
      page,
      size,
    ] as const,
};

/**
 * Organizations hook.
 */
export function useOrganizations(
  page = 1,
  size = 10,
) {
  return useQuery<OrganizationListResponse>({
    queryKey: organizationQueryKeys.list(
      page,
      size,
    ),

    queryFn: () =>
      OrganizationService.getOrganizations(
        page,
        size,
      ),

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
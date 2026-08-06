/**
 * Organization hook.
 *
 * React Query hook for a single organization.
 */

import { useQuery } from "@tanstack/react-query";

import { OrganizationService } from "../services/organization.service";

import type {
  OrganizationResponse,
} from "../types/organization.types";

/**
 * Organization query keys.
 */
export const organizationQueryKeys = {
  all: ["organizations"] as const,

  detail: (organizationId: string) =>
    [...organizationQueryKeys.all, organizationId] as const,
};

/**
 * Organization hook.
 */
export function useOrganization(
  organizationId: string,
) {
  return useQuery<OrganizationResponse>({
    queryKey: organizationQueryKeys.detail(
      organizationId,
    ),

    queryFn: () =>
      OrganizationService.getOrganization(
        organizationId,
      ),

    enabled: organizationId.length > 0,

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
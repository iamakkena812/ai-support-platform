/**
 * React Query hooks for organization list and mutations.
 *
 * Provides hooks for listing, creating, updating, and deleting
 * organizations. The single-entity read hook lives in
 * `useOrganization.ts` to avoid two competing definitions.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { organizationQueryKeys } from "./useOrganization";

import { OrganizationService } from "../services/organization.service";

import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListResponse,
  UpdateOrganizationRequest,
} from "../types/organization.types";


export const organizationListQueryKeys = {
  all: organizationQueryKeys.all,

  lists: () =>
    [
      ...organizationQueryKeys.all,
      "list",
    ] as const,

  list: (
    page: number,
    pageSize: number,
  ) =>
    [
      ...organizationListQueryKeys.lists(),
      page,
      pageSize,
    ] as const,
};


/**
 * Retrieves organizations.
 *
 * @param page Page number.
 * @param pageSize Page size.
 * @returns Organization list query.
 */
export function useOrganizations(
  page = 1,
  pageSize = 10,
) {
  return useQuery<OrganizationListResponse>({
    queryKey:
      organizationListQueryKeys.list(
        page,
        pageSize,
      ),

    queryFn: () =>
      OrganizationService.getOrganizations(
        page,
        pageSize,
      ),

    staleTime:
      5 * 60 * 1000,

    gcTime:
      10 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus:
      false,
  });
}


/**
 * Creates organization.
 */
export function useCreateOrganization() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Organization,
    Error,
    CreateOrganizationRequest
  >({
    mutationFn:
      (payload) =>
        OrganizationService.createOrganization(
          payload,
        ),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey:
            organizationQueryKeys.all,
        },
      );
    },
  });
}


/**
 * Update organization variables.
 */
export interface UpdateOrganizationVariables {
  /**
   * Organization identifier.
   */
  readonly id: string;

  /**
   * Update payload.
   */
  readonly payload: UpdateOrganizationRequest;
}


/**
 * Updates organization.
 */
export function useUpdateOrganization() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Organization,
    Error,
    UpdateOrganizationVariables
  >({
    mutationFn:
      ({ id, payload }) =>
        OrganizationService.updateOrganization(
          id,
          payload,
        ),

    onSuccess: async (
      _,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries(
          {
            queryKey:
              organizationQueryKeys.all,
          },
        ),

        queryClient.invalidateQueries(
          {
            queryKey:
              organizationQueryKeys.detail(
                variables.id,
              ),
          },
        ),
      ]);
    },
  });
}


/**
 * Deletes organization.
 */
export function useDeleteOrganization() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn:
      (id) =>
        OrganizationService.deleteOrganization(
          id,
        ),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey:
            organizationQueryKeys.all,
        },
      );
    },
  });
}

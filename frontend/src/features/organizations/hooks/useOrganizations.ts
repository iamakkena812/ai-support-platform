/**
 * React Query hooks for organization operations.
 *
 * Provides hooks for listing, retrieving,
 * creating, updating, and deleting organizations.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { OrganizationService } from "../services/organization.service";

import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListResponse,
  UpdateOrganizationRequest,
} from "../types/organization.types";


/**
 * Organization query keys.
 */
export const organizationQueryKeys = {
  all: [
    "organizations",
  ] as const,

  lists: () =>
    [
      ...organizationQueryKeys.all,
      "list",
    ] as const,

  list: (
    page: number,
    size: number,
  ) =>
    [
      ...organizationQueryKeys.lists(),
      page,
      size,
    ] as const,

  detail: (
    id: string,
  ) =>
    [
      ...organizationQueryKeys.all,
      "detail",
      id,
    ] as const,
};


/**
 * Retrieves organizations.
 *
 * @param page Page number.
 * @param size Page size.
 * @returns Organization list query.
 */
export function useOrganizations(
  page = 1,
  size = 10,
) {
  return useQuery<OrganizationListResponse>({
    queryKey:
      organizationQueryKeys.list(
        page,
        size,
      ),

    queryFn: () =>
      OrganizationService.getOrganizations(
        page,
        size,
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
 * Retrieves single organization.
 *
 * @param id Organization identifier.
 * @returns Organization query.
 */
export function useOrganization(
  id: string,
) {
  return useQuery<Organization>({
    queryKey:
      organizationQueryKeys.detail(
        id,
      ),

    queryFn: async () => {
      const response =
        await OrganizationService.getOrganization(
          id,
        );

      return response.organization;
    },

    enabled:
      Boolean(id),
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
      async (
        payload,
      ) => {
        const response =
          await OrganizationService.createOrganization(
            payload,
          );

        return response.organization;
      },

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
      async ({
        id,
        payload,
      }) => {
        const response =
          await OrganizationService.updateOrganization(
            id,
            payload,
          );

        return response.organization;
      },

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
      (
        id,
      ) =>
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
/**
 * React Query hooks for the SLA policy collection and breach reporting.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { slaQueryKeys } from "./useSLAPolicy";
import { slaService } from "../services/sla.service";

import type {
  BreachedTicket,
  CreateSLAPolicyRequest,
  SLAPolicy,
  UpdateSLAPolicyRequest,
} from "../types/sla.types";

/**
 * Retrieves the SLA policies belonging to the caller's organization.
 *
 * @param activeOnly - Whether to return only active policies.
 * @returns React Query result.
 */
export const useSLAPolicies = (activeOnly = false) =>
  useQuery<readonly SLAPolicy[]>({
    queryKey: [...slaQueryKeys.all, "list", activeOnly] as const,

    queryFn: () => slaService.listPolicies(activeOnly),
  });

/**
 * Retrieves breached SLA tickets for the caller's organization.
 *
 * @returns React Query result.
 */
export const useSLABreached = () =>
  useQuery<readonly BreachedTicket[]>({
    queryKey: slaQueryKeys.breached(),

    queryFn: () => slaService.listBreached(),
  });

/**
 * Creates a new SLA policy.
 *
 * @returns Mutation.
 */
export const useCreateSLAPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<SLAPolicy, Error, CreateSLAPolicyRequest>({
    mutationFn: (payload) => slaService.createPolicy(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slaQueryKeys.all });
    },
  });
};

/**
 * Update SLA policy variables.
 */
interface UpdateSLAPolicyVariables {
  readonly id: string;
  readonly payload: UpdateSLAPolicyRequest;
}

/**
 * Updates an SLA policy.
 *
 * @returns Mutation.
 */
export const useUpdateSLAPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<SLAPolicy, Error, UpdateSLAPolicyVariables>({
    mutationFn: ({ id, payload }) => slaService.updatePolicy(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: slaQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: slaQueryKeys.policyDetail(variables.id),
        }),
      ]);
    },
  });
};

/**
 * Deletes an SLA policy.
 *
 * @returns Mutation.
 */
export const useDeleteSLAPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (policyId) => slaService.deletePolicy(policyId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slaQueryKeys.all });
    },
  });
};

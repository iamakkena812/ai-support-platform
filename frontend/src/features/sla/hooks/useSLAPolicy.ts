/**
 * React Query hook for a single SLA policy.
 */

import { useQuery } from "@tanstack/react-query";

import { slaService } from "../services/sla.service";

import type { SLAPolicy } from "../types/sla.types";

/**
 * Query keys for SLA.
 */
export const slaQueryKeys = {
  all: ["sla"] as const,
  policyDetail: (policyId: string) =>
    [...slaQueryKeys.all, "policy", policyId] as const,
  breached: () => [...slaQueryKeys.all, "breached"] as const,
};

/**
 * Retrieves a single SLA policy.
 *
 * @param policyId - Policy identifier.
 * @returns React Query result.
 */
export const useSLAPolicy = (policyId: string) =>
  useQuery<SLAPolicy>({
    queryKey: slaQueryKeys.policyDetail(policyId),

    queryFn: () => slaService.getPolicy(policyId),

    enabled: policyId.length > 0,
  });

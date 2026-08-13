/**
 * React Query hook for a single workflow.
 */

import { useQuery } from "@tanstack/react-query";

import { workflowService } from "../services/workflow.service";

import type { Workflow } from "../types/workflow.types";

/**
 * Query keys for workflows.
 */
export const workflowQueryKeys = {
  all: ["workflows"] as const,
  detail: (workflowId: string) =>
    [...workflowQueryKeys.all, "detail", workflowId] as const,
};

/**
 * Retrieves a single workflow.
 *
 * @param workflowId - Workflow identifier.
 * @returns React Query result.
 */
export const useWorkflow = (workflowId: string) =>
  useQuery<Workflow>({
    queryKey: workflowQueryKeys.detail(workflowId),

    queryFn: () => workflowService.getWorkflow(workflowId),

    enabled: workflowId.length > 0,
  });

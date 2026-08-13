/**
 * React Query hooks for the workflow collection.
 *
 * Provides hooks for listing, creating, updating, deleting, activating,
 * deactivating, and executing workflows.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { workflowQueryKeys } from "./useWorkflow";
import { workflowService } from "../services/workflow.service";

import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  Workflow,
  WorkflowExecuteResult,
} from "../types/workflow.types";

/**
 * Retrieves the workflows belonging to the caller's organization.
 *
 * @param activeOnly - Whether to return only active workflows.
 * @returns React Query result.
 */
export const useWorkflows = (activeOnly = false) =>
  useQuery<readonly Workflow[]>({
    queryKey: [...workflowQueryKeys.all, "list", activeOnly] as const,

    queryFn: () => workflowService.listWorkflows(activeOnly),
  });

/**
 * Creates a new workflow.
 *
 * @returns Mutation.
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation<Workflow, Error, CreateWorkflowRequest>({
    mutationFn: (payload) => workflowService.createWorkflow(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workflowQueryKeys.all,
      });
    },
  });
};

/**
 * Update workflow variables.
 */
interface UpdateWorkflowVariables {
  readonly id: string;
  readonly payload: UpdateWorkflowRequest;
}

/**
 * Updates a workflow.
 *
 * @returns Mutation.
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation<Workflow, Error, UpdateWorkflowVariables>({
    mutationFn: ({ id, payload }) =>
      workflowService.updateWorkflow(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workflowQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: workflowQueryKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

/**
 * Deletes a workflow.
 *
 * @returns Mutation.
 */
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (workflowId) => workflowService.deleteWorkflow(workflowId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workflowQueryKeys.all,
      });
    },
  });
};

/**
 * Activates or deactivates a workflow.
 *
 * @returns Mutation.
 */
export const useSetWorkflowActive = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Workflow,
    Error,
    { readonly id: string; readonly isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) =>
      isActive
        ? workflowService.activateWorkflow(id)
        : workflowService.deactivateWorkflow(id),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workflowQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: workflowQueryKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

/**
 * Executes a workflow against a ticket.
 *
 * @returns Mutation.
 */
export const useExecuteWorkflow = () =>
  useMutation<
    WorkflowExecuteResult,
    Error,
    { readonly workflowId: string; readonly ticketId: string }
  >({
    mutationFn: ({ workflowId, ticketId }) =>
      workflowService.executeWorkflow(workflowId, ticketId),
  });

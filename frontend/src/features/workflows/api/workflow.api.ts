/**
 * Workflow API.
 *
 * Talks to the real backend Workflow endpoints (`/api/v1/workflows/*`,
 * see `app/workflows/router.py`), which use a plain snake_case JSON
 * contract (no camelCase alias generator).
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  Workflow,
  WorkflowExecuteResult,
} from "../types/workflow.types";

interface BackendWorkflowCondition {
  readonly id: string;
  readonly workflow_id: string;
  readonly field: string;
  readonly operator: string;
  readonly value: string;
}

interface BackendWorkflowAction {
  readonly id: string;
  readonly workflow_id: string;
  readonly action: string;
  readonly value: string | null;
  readonly execution_order: number;
}

interface BackendWorkflow {
  readonly id: string;
  readonly organization_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly trigger: string;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly conditions: readonly BackendWorkflowCondition[];
  readonly actions: readonly BackendWorkflowAction[];
}

interface BackendWorkflowExecuteResponse {
  readonly workflow_id: string;
  readonly ticket_id: string;
  readonly executed: boolean;
  readonly actions_executed: number;
  readonly message: string;
}

const BASE_PATH = "/workflows";

/**
 * Maps a backend workflow into the frontend model.
 *
 * @param workflow - Backend workflow.
 * @returns Frontend workflow.
 */
function mapWorkflow(workflow: BackendWorkflow): Workflow {
  return {
    id: workflow.id,
    organizationId: workflow.organization_id,
    name: workflow.name,
    description: workflow.description,
    trigger: workflow.trigger,
    isActive: workflow.is_active,
    createdAt: workflow.created_at,
    updatedAt: workflow.updated_at,
    conditions: workflow.conditions.map((condition) => ({
      id: condition.id,
      workflowId: condition.workflow_id,
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
    })),
    actions: workflow.actions.map((action) => ({
      id: action.id,
      workflowId: action.workflow_id,
      action: action.action,
      value: action.value,
      executionOrder: action.execution_order,
    })),
  };
}

/**
 * Workflow API client.
 */
export const workflowApi = {
  /**
   * Returns the workflows belonging to the caller's organization.
   *
   * @param activeOnly - Whether to return only active workflows.
   * @returns Workflows.
   */
  async listWorkflows(activeOnly = false): Promise<readonly Workflow[]> {
    const { data } = await apiClient.get<readonly BackendWorkflow[]>(
      BASE_PATH,
      {
        params: { active_only: activeOnly },
      },
    );

    return data.map(mapWorkflow);
  },

  /**
   * Returns a single workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Workflow.
   */
  async getWorkflow(workflowId: string): Promise<Workflow> {
    const { data } = await apiClient.get<BackendWorkflow>(
      `${BASE_PATH}/${workflowId}`,
    );

    return mapWorkflow(data);
  },

  /**
   * Creates a new workflow.
   *
   * @param request - Workflow creation request.
   * @returns Created workflow.
   */
  async createWorkflow(request: CreateWorkflowRequest): Promise<Workflow> {
    const { data } = await apiClient.post<BackendWorkflow>(BASE_PATH, {
      name: request.name,
      description: request.description,
      trigger: request.trigger,
      is_active: request.isActive ?? true,
      conditions: [],
      actions: [],
    });

    return mapWorkflow(data);
  },

  /**
   * Updates a workflow.
   *
   * @param workflowId - Workflow identifier.
   * @param request - Update request.
   * @returns Updated workflow.
   */
  async updateWorkflow(
    workflowId: string,
    request: UpdateWorkflowRequest,
  ): Promise<Workflow> {
    const { data } = await apiClient.patch<BackendWorkflow>(
      `${BASE_PATH}/${workflowId}`,
      {
        name: request.name,
        description: request.description,
        trigger: request.trigger,
        is_active: request.isActive,
      },
    );

    return mapWorkflow(data);
  },

  /**
   * Deletes a workflow.
   *
   * @param workflowId - Workflow identifier.
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${workflowId}`);
  },

  /**
   * Activates a workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Updated workflow.
   */
  async activateWorkflow(workflowId: string): Promise<Workflow> {
    const { data } = await apiClient.post<BackendWorkflow>(
      `${BASE_PATH}/${workflowId}/activate`,
    );

    return mapWorkflow(data);
  },

  /**
   * Deactivates a workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Updated workflow.
   */
  async deactivateWorkflow(workflowId: string): Promise<Workflow> {
    const { data } = await apiClient.post<BackendWorkflow>(
      `${BASE_PATH}/${workflowId}/deactivate`,
    );

    return mapWorkflow(data);
  },

  /**
   * Executes a workflow against a ticket.
   *
   * The backend has no worker/action-dispatch integration configured,
   * so this currently always rejects with a 501 error rather than a
   * fabricated success -- callers should surface that error, not hide it.
   *
   * @param workflowId - Workflow identifier.
   * @param ticketId - Ticket identifier.
   * @returns Execution result.
   */
  async executeWorkflow(
    workflowId: string,
    ticketId: string,
  ): Promise<WorkflowExecuteResult> {
    const { data } = await apiClient.post<BackendWorkflowExecuteResponse>(
      `${BASE_PATH}/${workflowId}/execute`,
      { ticket_id: ticketId },
    );

    return {
      workflowId: data.workflow_id,
      ticketId: data.ticket_id,
      executed: data.executed,
      actionsExecuted: data.actions_executed,
      message: data.message,
    };
  },
};

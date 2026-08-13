/**
 * Workflow service.
 *
 * Provides the service layer between the UI and the Workflow API client.
 */

import { workflowApi } from "../api/workflow.api";

import type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  Workflow,
  WorkflowExecuteResult,
} from "../types/workflow.types";

/**
 * Workflow service.
 */
export const workflowService = {
  /**
   * Returns the workflows belonging to the caller's organization.
   *
   * @param activeOnly - Whether to return only active workflows.
   * @returns Workflows.
   */
  async listWorkflows(activeOnly = false): Promise<readonly Workflow[]> {
    return workflowApi.listWorkflows(activeOnly);
  },

  /**
   * Returns a single workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Workflow.
   */
  async getWorkflow(workflowId: string): Promise<Workflow> {
    return workflowApi.getWorkflow(workflowId);
  },

  /**
   * Creates a new workflow.
   *
   * @param request - Workflow creation request.
   * @returns Created workflow.
   */
  async createWorkflow(request: CreateWorkflowRequest): Promise<Workflow> {
    return workflowApi.createWorkflow(request);
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
    return workflowApi.updateWorkflow(workflowId, request);
  },

  /**
   * Deletes a workflow.
   *
   * @param workflowId - Workflow identifier.
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    return workflowApi.deleteWorkflow(workflowId);
  },

  /**
   * Activates a workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Updated workflow.
   */
  async activateWorkflow(workflowId: string): Promise<Workflow> {
    return workflowApi.activateWorkflow(workflowId);
  },

  /**
   * Deactivates a workflow.
   *
   * @param workflowId - Workflow identifier.
   * @returns Updated workflow.
   */
  async deactivateWorkflow(workflowId: string): Promise<Workflow> {
    return workflowApi.deactivateWorkflow(workflowId);
  },

  /**
   * Executes a workflow against a ticket.
   *
   * @param workflowId - Workflow identifier.
   * @param ticketId - Ticket identifier.
   * @returns Execution result.
   */
  async executeWorkflow(
    workflowId: string,
    ticketId: string,
  ): Promise<WorkflowExecuteResult> {
    return workflowApi.executeWorkflow(workflowId, ticketId);
  },
};

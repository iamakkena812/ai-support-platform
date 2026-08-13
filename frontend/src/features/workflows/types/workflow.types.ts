/**
 * Workflow domain types.
 *
 * Mirrors the real backend contract in `app/workflows/schemas.py`.
 */

/**
 * Supported workflow trigger events.
 *
 * Matches `WorkflowTrigger` in `app/workflows/constants.py`.
 */
export type WorkflowTrigger =
  | "ticket_created"
  | "ticket_updated"
  | "ticket_assigned"
  | "ticket_resolved"
  | "ticket_closed"
  | "comment_created"
  | "attachment_uploaded"
  | "sla_breached";

/**
 * A single workflow condition.
 */
export interface WorkflowConditionItem {
  readonly id: string;
  readonly workflowId: string;
  readonly field: string;
  readonly operator: string;
  readonly value: string;
}

/**
 * A single workflow action.
 */
export interface WorkflowActionItem {
  readonly id: string;
  readonly workflowId: string;
  readonly action: string;
  readonly value: string | null;
  readonly executionOrder: number;
}

/**
 * Workflow automation definition.
 */
export interface Workflow {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string | null;
  readonly trigger: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly conditions: readonly WorkflowConditionItem[];
  readonly actions: readonly WorkflowActionItem[];
}

/**
 * Request to create a workflow.
 *
 * `organizationId` is deliberately absent -- the backend derives it from
 * the authenticated caller, never trusting client-supplied values.
 */
export interface CreateWorkflowRequest {
  readonly name: string;
  readonly description?: string;
  readonly trigger: WorkflowTrigger;
  readonly isActive?: boolean;
}

/**
 * Request to update a workflow.
 */
export interface UpdateWorkflowRequest {
  readonly name?: string;
  readonly description?: string;
  readonly trigger?: WorkflowTrigger;
  readonly isActive?: boolean;
}

/**
 * Response returned after attempting to execute a workflow.
 *
 * `executed` reflects the real outcome -- the backend has no worker or
 * action-dispatch integration wired up, so execution requests currently
 * fail with a clear "not configured" error rather than a fabricated
 * success (see `app/workflows/service.py::execute_workflow`).
 */
export interface WorkflowExecuteResult {
  readonly workflowId: string;
  readonly ticketId: string;
  readonly executed: boolean;
  readonly actionsExecuted: number;
  readonly message: string;
}

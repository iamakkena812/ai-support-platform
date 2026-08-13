/**
 * Workflow details page.
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DeleteWorkflowDialog } from "../components/DeleteWorkflowDialog";
import { WorkflowStatusBadge } from "../components/WorkflowStatusBadge";
import { useWorkflow } from "../hooks/useWorkflow";
import {
  useDeleteWorkflow,
  useExecuteWorkflow,
  useSetWorkflowActive,
} from "../hooks/useWorkflows";

/**
 * Workflow details page.
 *
 * @returns Workflow details page component.
 */
export function WorkflowDetailsPage(): React.JSX.Element {
  const { workflowId = "" } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();

  const [ticketId, setTicketId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: workflow, isLoading, isError, error } = useWorkflow(
    workflowId,
  );

  const setActiveMutation = useSetWorkflowActive();
  const deleteWorkflowMutation = useDeleteWorkflow();
  const executeMutation = useExecuteWorkflow();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading workflow...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error ? error.message : "Failed to load workflow."}
      </div>
    );
  }

  if (workflow == null) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Workflow not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {workflow.name}
            </h1>
            <WorkflowStatusBadge isActive={workflow.isActive} />
          </div>

          {workflow.description ? (
            <p className="mt-1 text-gray-600">{workflow.description}</p>
          ) : null}

          <p className="mt-1 text-sm capitalize text-gray-500">
            Trigger: {workflow.trigger.replaceAll("_", " ")}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setActiveMutation.mutate({
                id: workflow.id,
                isActive: !workflow.isActive,
              })
            }
            disabled={setActiveMutation.isPending}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {workflow.isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Conditions</h2>

        {workflow.conditions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No conditions defined.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {workflow.conditions.map((condition) => (
              <li
                key={condition.id}
                className="rounded border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {condition.field} {condition.operator} &quot;
                {condition.value}&quot;
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Actions</h2>

        {workflow.actions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No actions defined.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {workflow.actions.map((action) => (
              <li
                key={action.id}
                className="rounded border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                #{action.executionOrder} {action.action.replaceAll("_", " ")}
                {action.value ? ` -> ${action.value}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Execute Against a Ticket
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Validates the workflow and ticket, but this environment has no
          worker or action-dispatch integration configured, so execution
          will not actually run the workflow&apos;s actions.
        </p>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={ticketId}
            onChange={(event) => setTicketId(event.target.value)}
            placeholder="Ticket ID"
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={() =>
              executeMutation.mutate({
                workflowId: workflow.id,
                ticketId: ticketId.trim(),
              })
            }
            disabled={executeMutation.isPending || ticketId.trim().length === 0}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {executeMutation.isPending ? "Executing..." : "Execute"}
          </button>
        </div>

        {executeMutation.isError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {executeMutation.error instanceof Error
              ? executeMutation.error.message
              : "Execution failed."}
          </div>
        ) : null}

        {executeMutation.isSuccess ? (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {executeMutation.data.message}
          </div>
        ) : null}
      </section>

      {isDeleteDialogOpen ? (
        <DeleteWorkflowDialog
          workflow={workflow}
          isOpen
          isDeleting={deleteWorkflowMutation.isPending}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={async (target) => {
            await deleteWorkflowMutation.mutateAsync(target.id);
            navigate("/workflows");
          }}
        />
      ) : null}
    </div>
  );
}

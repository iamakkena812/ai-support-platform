/**
 * Workflows page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DeleteWorkflowDialog } from "../components/DeleteWorkflowDialog";
import { WorkflowList } from "../components/WorkflowList";
import { useDeleteWorkflow, useWorkflows } from "../hooks/useWorkflows";

import type { Workflow } from "../types/workflow.types";

/**
 * Workflows page.
 *
 * @returns Workflows page component.
 */
export function WorkflowsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(
    null,
  );

  const { data, isLoading, isError, error } = useWorkflows();

  const deleteWorkflowMutation = useDeleteWorkflow();

  /**
   * Handles viewing a workflow.
   *
   * @param workflow - Selected workflow.
   */
  const handleView = (workflow: Workflow): void => {
    navigate(`/workflows/${workflow.id}`);
  };

  /**
   * Confirms deletion of the selected workflow.
   *
   * @param workflow - Workflow to delete.
   */
  const handleConfirmDelete = async (workflow: Workflow): Promise<void> => {
    await deleteWorkflowMutation.mutateAsync(workflow.id);
    setWorkflowToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>

          <p className="mt-1 text-gray-600">
            Automation rules that trigger on ticket and support events.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/workflows/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create Workflow
        </button>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading workflows...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load workflows."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <WorkflowList
          workflows={data ?? []}
          onView={handleView}
          onDelete={setWorkflowToDelete}
        />
      ) : null}

      {workflowToDelete ? (
        <DeleteWorkflowDialog
          workflow={workflowToDelete}
          isOpen
          isDeleting={deleteWorkflowMutation.isPending}
          onClose={() => setWorkflowToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}

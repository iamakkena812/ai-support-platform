/**
 * Create workflow page.
 */

import { useNavigate } from "react-router-dom";

import { WorkflowForm } from "../components/WorkflowForm";
import { useCreateWorkflow } from "../hooks/useWorkflows";

import type { WorkflowTrigger } from "../types/workflow.types";

/**
 * Create workflow page.
 *
 * @returns Create workflow page component.
 */
export function CreateWorkflowPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createWorkflowMutation = useCreateWorkflow();

  /**
   * Handles form submission.
   *
   * @param values - Form values.
   */
  const handleSubmit = async (values: {
    readonly name: string;
    readonly description: string;
    readonly trigger: WorkflowTrigger;
    readonly isActive: boolean;
  }): Promise<void> => {
    const created = await createWorkflowMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
      trigger: values.trigger,
      isActive: values.isActive,
    });

    navigate(`/workflows/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Create Workflow</h1>

        <p className="mt-1 text-gray-600">
          Define a new automation rule for your organization.
        </p>
      </header>

      {createWorkflowMutation.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {createWorkflowMutation.error instanceof Error
            ? createWorkflowMutation.error.message
            : "Failed to create workflow."}
        </div>
      ) : null}

      <WorkflowForm
        isSubmitting={createWorkflowMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

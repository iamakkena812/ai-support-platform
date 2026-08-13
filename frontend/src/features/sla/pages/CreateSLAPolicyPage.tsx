/**
 * Create SLA policy page.
 */

import { useNavigate } from "react-router-dom";

import { SLAPolicyForm } from "../components/SLAPolicyForm";
import { useCreateSLAPolicy } from "../hooks/useSLAPolicies";

import type { SLAPriority } from "../types/sla.types";

/**
 * Create SLA policy page.
 *
 * @returns Create SLA policy page component.
 */
export function CreateSLAPolicyPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createPolicyMutation = useCreateSLAPolicy();

  /**
   * Handles form submission.
   *
   * @param values - Form values.
   */
  const handleSubmit = async (values: {
    readonly name: string;
    readonly description: string;
    readonly priority: SLAPriority;
    readonly firstResponseMinutes: number;
    readonly resolutionMinutes: number;
    readonly businessHoursOnly: boolean;
    readonly isActive: boolean;
  }): Promise<void> => {
    const created = await createPolicyMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
      priority: values.priority,
      firstResponseMinutes: values.firstResponseMinutes,
      resolutionMinutes: values.resolutionMinutes,
      businessHoursOnly: values.businessHoursOnly,
      isActive: values.isActive,
    });

    navigate(`/sla/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Create SLA Policy
        </h1>

        <p className="mt-1 text-gray-600">
          Define response and resolution targets for your organization.
        </p>
      </header>

      {createPolicyMutation.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {createPolicyMutation.error instanceof Error
            ? createPolicyMutation.error.message
            : "Failed to create SLA policy."}
        </div>
      ) : null}

      <SLAPolicyForm
        isSubmitting={createPolicyMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

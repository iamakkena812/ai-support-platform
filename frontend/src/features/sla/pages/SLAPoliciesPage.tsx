/**
 * SLA policies page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BreachedTicketsList } from "../components/BreachedTicketsList";
import { DeleteSLAPolicyDialog } from "../components/DeleteSLAPolicyDialog";
import { SLAPolicyList } from "../components/SLAPolicyList";
import { useDeleteSLAPolicy, useSLABreached, useSLAPolicies } from "../hooks/useSLAPolicies";

import type { SLAPolicy } from "../types/sla.types";

/**
 * SLA policies page.
 *
 * @returns SLA policies page component.
 */
export function SLAPoliciesPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [policyToDelete, setPolicyToDelete] = useState<SLAPolicy | null>(
    null,
  );

  const { data, isLoading, isError, error } = useSLAPolicies();
  const {
    data: breached,
    isLoading: isBreachedLoading,
  } = useSLABreached();

  const deletePolicyMutation = useDeleteSLAPolicy();

  /**
   * Handles viewing a policy.
   *
   * @param policy - Selected policy.
   */
  const handleView = (policy: SLAPolicy): void => {
    navigate(`/sla/${policy.id}`);
  };

  /**
   * Confirms deletion of the selected policy.
   *
   * @param policy - Policy to delete.
   */
  const handleConfirmDelete = async (policy: SLAPolicy): Promise<void> => {
    await deletePolicyMutation.mutateAsync(policy.id);
    setPolicyToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SLA Policies</h1>

          <p className="mt-1 text-gray-600">
            Response and resolution targets for your organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/sla/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create SLA Policy
        </button>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Breached SLAs
        </h2>

        {isBreachedLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            Loading breached SLAs...
          </div>
        ) : (
          <BreachedTicketsList tickets={breached ?? []} />
        )}
      </section>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading SLA policies...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load SLA policies."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <SLAPolicyList
          policies={data ?? []}
          onView={handleView}
          onDelete={setPolicyToDelete}
        />
      ) : null}

      {policyToDelete ? (
        <DeleteSLAPolicyDialog
          policy={policyToDelete}
          isOpen
          isDeleting={deletePolicyMutation.isPending}
          onClose={() => setPolicyToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}

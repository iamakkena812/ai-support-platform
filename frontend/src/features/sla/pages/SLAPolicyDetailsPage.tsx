/**
 * SLA policy details page.
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { DeleteSLAPolicyDialog } from "../components/DeleteSLAPolicyDialog";
import { SLAPriorityBadge, SLAStatusBadge } from "../components/SLABadges";
import { useSLAPolicy } from "../hooks/useSLAPolicy";
import { useDeleteSLAPolicy, useUpdateSLAPolicy } from "../hooks/useSLAPolicies";
import { slaService } from "../services/sla.service";

import type { SLAEvent } from "../types/sla.types";

/**
 * SLA policy details page.
 *
 * @returns SLA policy details page component.
 */
export function SLAPolicyDetailsPage(): React.JSX.Element {
  const { policyId = "" } = useParams<{ policyId: string }>();
  const navigate = useNavigate();

  const [ticketId, setTicketId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: policy, isLoading, isError, error } = useSLAPolicy(policyId);

  const updatePolicyMutation = useUpdateSLAPolicy();
  const deletePolicyMutation = useDeleteSLAPolicy();

  const assignMutation = useMutation<SLAEvent, Error, void>({
    mutationFn: () => slaService.assignPolicy(ticketId.trim(), policyId),
  });

  const checkMutation = useMutation<SLAEvent, Error, void>({
    mutationFn: () => slaService.getTicketSLA(ticketId.trim()),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading SLA policy...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error ? error.message : "Failed to load policy."}
      </div>
    );
  }

  if (policy == null) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        SLA policy not found.
      </div>
    );
  }

  const activeResult = assignMutation.data ?? checkMutation.data;
  const activeError = assignMutation.error ?? checkMutation.error;
  const isChecking = assignMutation.isPending || checkMutation.isPending;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {policy.name}
            </h1>
            <SLAPriorityBadge priority={policy.priority} />
            <SLAStatusBadge isActive={policy.isActive} />
          </div>

          {policy.description ? (
            <p className="mt-1 text-gray-600">{policy.description}</p>
          ) : null}

          <p className="mt-1 text-sm text-gray-500">
            First response: {policy.firstResponseMinutes} min &middot;
            Resolution: {policy.resolutionMinutes} min
            {policy.businessHoursOnly ? " (business hours only)" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              updatePolicyMutation.mutate({
                id: policy.id,
                payload: { isActive: !policy.isActive },
              })
            }
            disabled={updatePolicyMutation.isPending}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {policy.isActive ? "Deactivate" : "Activate"}
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
        <h2 className="text-lg font-semibold text-gray-900">
          Ticket SLA Tracking
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Assign this policy to a ticket, or check an existing ticket&apos;s
          SLA status.
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
            onClick={() => assignMutation.mutate()}
            disabled={isChecking || ticketId.trim().length === 0}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Assign Policy
          </button>

          <button
            type="button"
            onClick={() => checkMutation.mutate()}
            disabled={isChecking || ticketId.trim().length === 0}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Status
          </button>
        </div>

        {activeError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {activeError.message}
          </div>
        ) : null}

        {activeResult ? (
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <dt className="font-medium text-gray-600">First response due</dt>
            <dd>{new Date(activeResult.firstResponseDue).toLocaleString()}</dd>

            <dt className="font-medium text-gray-600">Resolution due</dt>
            <dd>{new Date(activeResult.resolutionDue).toLocaleString()}</dd>

            <dt className="font-medium text-gray-600">
              First response breached
            </dt>
            <dd>{activeResult.firstResponseBreached ? "Yes" : "No"}</dd>

            <dt className="font-medium text-gray-600">Resolution breached</dt>
            <dd>{activeResult.resolutionBreached ? "Yes" : "No"}</dd>
          </dl>
        ) : null}
      </section>

      {isDeleteDialogOpen ? (
        <DeleteSLAPolicyDialog
          policy={policy}
          isOpen
          isDeleting={deletePolicyMutation.isPending}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={async (target) => {
            await deletePolicyMutation.mutateAsync(target.id);
            navigate("/sla");
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * SLA policy list component.
 *
 * Displays a collection of SLA policies in a table.
 */

import type { FC } from "react";

import { SLAPriorityBadge, SLAStatusBadge } from "./SLABadges";

import type { SLAPolicy } from "../types/sla.types";

/**
 * Component properties.
 */
export interface SLAPolicyListProps {
  /**
   * Collection of SLA policies.
   */
  readonly policies: readonly SLAPolicy[];

  /**
   * Invoked when a policy is selected.
   */
  readonly onView?: (policy: SLAPolicy) => void;

  /**
   * Invoked when a policy is deleted.
   */
  readonly onDelete?: (policy: SLAPolicy) => void;
}

/**
 * SLA policy list.
 *
 * @param props - Component properties.
 * @returns Policy list component.
 */
export const SLAPolicyList: FC<SLAPolicyListProps> = ({
  policies,
  onView,
  onDelete,
}) => {
  if (policies.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No SLA policies found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Priority
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              First Response
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Resolution
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onView?.(policy)}
            >
              <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-gray-900">
                {policy.name}
              </td>

              <td className="px-4 py-3">
                <SLAPriorityBadge priority={policy.priority} />
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {policy.firstResponseMinutes} min
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {policy.resolutionMinutes} min
              </td>

              <td className="px-4 py-3">
                <SLAStatusBadge isActive={policy.isActive} />
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete?.(policy);
                  }}
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

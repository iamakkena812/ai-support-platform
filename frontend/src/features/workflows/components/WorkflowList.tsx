/**
 * Workflow list component.
 *
 * Displays a collection of workflows in a table.
 */

import type { FC } from "react";

import { WorkflowStatusBadge } from "./WorkflowStatusBadge";

import type { Workflow } from "../types/workflow.types";

/**
 * Component properties.
 */
export interface WorkflowListProps {
  /**
   * Collection of workflows.
   */
  readonly workflows: readonly Workflow[];

  /**
   * Invoked when a workflow is selected.
   */
  readonly onView?: (workflow: Workflow) => void;

  /**
   * Invoked when a workflow is deleted.
   */
  readonly onDelete?: (workflow: Workflow) => void;
}

/**
 * Workflow list.
 *
 * @param props - Component properties.
 * @returns Workflow list component.
 */
export const WorkflowList: FC<WorkflowListProps> = ({
  workflows,
  onView,
  onDelete,
}) => {
  if (workflows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No workflows found.
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
              Trigger
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {workflows.map((workflow) => (
            <tr
              key={workflow.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onView?.(workflow)}
            >
              <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-gray-900">
                {workflow.name}
              </td>

              <td className="px-4 py-3 text-sm capitalize text-gray-600">
                {workflow.trigger.replaceAll("_", " ")}
              </td>

              <td className="px-4 py-3">
                <WorkflowStatusBadge isActive={workflow.isActive} />
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(workflow.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete?.(workflow);
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

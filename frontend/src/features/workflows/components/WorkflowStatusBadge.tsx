/**
 * Workflow status badge component.
 */

import type { FC } from "react";

/**
 * Component properties.
 */
export interface WorkflowStatusBadgeProps {
  /**
   * Whether the workflow is active.
   */
  readonly isActive: boolean;
}

/**
 * Workflow status badge.
 *
 * @param props - Component properties.
 * @returns Status badge component.
 */
export const WorkflowStatusBadge: FC<WorkflowStatusBadgeProps> = ({
  isActive,
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
      isActive
        ? "border-green-300 bg-green-50 text-green-700"
        : "border-gray-300 bg-gray-100 text-gray-500"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

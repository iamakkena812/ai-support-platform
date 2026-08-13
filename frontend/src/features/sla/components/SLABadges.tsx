/**
 * SLA priority and status badge components.
 */

import type { FC } from "react";

import type { SLAPriority } from "../types/sla.types";

/**
 * Component properties.
 */
export interface SLAPriorityBadgeProps {
  /**
   * SLA policy priority.
   */
  readonly priority: SLAPriority;
}

const PRIORITY_STYLES: Record<SLAPriority, string> = {
  low: "border-gray-300 bg-gray-100 text-gray-600",
  medium: "border-blue-300 bg-blue-50 text-blue-700",
  high: "border-amber-300 bg-amber-50 text-amber-700",
  critical: "border-red-300 bg-red-50 text-red-700",
};

/**
 * SLA priority badge.
 *
 * @param props - Component properties.
 * @returns Priority badge component.
 */
export const SLAPriorityBadge: FC<SLAPriorityBadgeProps> = ({ priority }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[priority]}`}
  >
    {priority}
  </span>
);

/**
 * Component properties.
 */
export interface SLAStatusBadgeProps {
  /**
   * Whether the policy is active.
   */
  readonly isActive: boolean;
}

/**
 * SLA policy active/inactive badge.
 *
 * @param props - Component properties.
 * @returns Status badge component.
 */
export const SLAStatusBadge: FC<SLAStatusBadgeProps> = ({ isActive }) => (
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

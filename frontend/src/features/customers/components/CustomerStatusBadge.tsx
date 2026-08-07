/**
 * Customer status badge component.
 *
 * Displays customer status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  PauseCircle,
  ShieldAlert,
  UserPlus,
  XCircle,
} from "lucide-react";

import type {
  CustomerStatus,
} from "../types/customer.types";

/**
 * Component properties.
 */
export interface CustomerStatusBadgeProps {
  /**
   * Customer status.
   */
  readonly status: CustomerStatus;
}


/**
 * Returns status configuration.
 *
 * @param status Customer status.
 * @returns Status configuration.
 */
function getStatusConfig(
  status: CustomerStatus,
): {
  readonly label: string;
  readonly className: string;
  readonly icon: React.JSX.Element;
} {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        className:
          "border-green-200 bg-green-100 text-green-700",
        icon: (
          <CheckCircle2
            size={16}
          />
        ),
      };

    case "INACTIVE":
      return {
        label: "Inactive",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <XCircle
            size={16}
          />
        ),
      };

    case "PROSPECT":
      return {
        label: "Prospect",
        className:
          "border-blue-200 bg-blue-100 text-blue-700",
        icon: (
          <UserPlus
            size={16}
          />
        ),
      };

    case "PENDING":
      return {
        label: "Pending",
        className:
          "border-yellow-200 bg-yellow-100 text-yellow-700",
        icon: (
          <Clock3
            size={16}
          />
        ),
      };

    case "SUSPENDED":
      return {
        label: "Suspended",
        className:
          "border-orange-200 bg-orange-100 text-orange-700",
        icon: (
          <PauseCircle
            size={16}
          />
        ),
      };

    case "BLOCKED":
      return {
        label: "Blocked",
        className:
          "border-red-200 bg-red-100 text-red-700",
        icon: (
          <ShieldAlert
            size={16}
          />
        ),
      };

    default:
      return {
        label: "Unknown",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <ShieldAlert
            size={16}
          />
        ),
      };
  }
}


/**
 * Customer status badge.
 *
 * @param props Component properties.
 * @returns Customer status badge.
 */
export function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps): React.JSX.Element {
  const config =
    getStatusConfig(status);

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        config.className,
      ].join(" ")}
    >
      {config.icon}

      {config.label}
    </span>
  );
}
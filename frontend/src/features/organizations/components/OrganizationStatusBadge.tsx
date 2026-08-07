/**
 * Organization status badge component.
 *
 * Displays the organization status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  PauseCircle,
  XCircle,
} from "lucide-react";

/**
 * Organization status.
 */
export type OrganizationStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING";

/**
 * Component properties.
 */
export interface OrganizationStatusBadgeProps {
  /**
   * Organization status.
   */
  readonly status: string;
}

/**
 * Returns badge configuration.
 *
 * @param status Organization status.
 * @returns Badge configuration.
 */
function getStatusConfig(
  status: string,
): {
  readonly label: string;
  readonly className: string;
  readonly icon: React.JSX.Element;
} {
  switch (
    status.toUpperCase()
  ) {
    case "ACTIVE":
      return {
        label: "Active",
        className:
          "bg-green-100 text-green-700 border-green-200",
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
          "bg-slate-100 text-slate-700 border-slate-200",
        icon: (
          <PauseCircle
            size={16}
          />
        ),
      };

    case "SUSPENDED":
      return {
        label: "Suspended",
        className:
          "bg-red-100 text-red-700 border-red-200",
        icon: (
          <XCircle
            size={16}
          />
        ),
      };

    case "PENDING":
      return {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: (
          <Clock3
            size={16}
          />
        ),
      };

    default:
      return {
        label: status,
        className:
          "bg-slate-100 text-slate-700 border-slate-200",
        icon: (
          <PauseCircle
            size={16}
          />
        ),
      };
  }
}

/**
 * Organization status badge.
 *
 * @param props Component properties.
 * @returns Organization status badge.
 */
export function OrganizationStatusBadge({
  status,
}: OrganizationStatusBadgeProps): React.JSX.Element {
  const config =
    getStatusConfig(
      status,
    );

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
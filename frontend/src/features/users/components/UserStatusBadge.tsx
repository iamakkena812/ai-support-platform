/**
 * User status badge component.
 *
 * Displays the user status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  Lock,
  PauseCircle,
  XCircle,
} from "lucide-react";

/**
 * User status.
 */
export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "LOCKED"
  | "SUSPENDED";

/**
 * Component properties.
 */
export interface UserStatusBadgeProps {
  /**
   * User status.
   */
  readonly status: string;
}

/**
 * Returns badge configuration.
 *
 * @param status User status.
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
          <PauseCircle
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

    case "LOCKED":
      return {
        label: "Locked",
        className:
          "border-orange-200 bg-orange-100 text-orange-700",
        icon: (
          <Lock
            size={16}
          />
        ),
      };

    case "SUSPENDED":
      return {
        label: "Suspended",
        className:
          "border-red-200 bg-red-100 text-red-700",
        icon: (
          <XCircle
            size={16}
          />
        ),
      };

    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <PauseCircle
            size={16}
          />
        ),
      };
  }
}

/**
 * User status badge.
 *
 * @param props Component properties.
 * @returns User status badge component.
 */
export function UserStatusBadge({
  status,
}: UserStatusBadgeProps): React.JSX.Element {
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
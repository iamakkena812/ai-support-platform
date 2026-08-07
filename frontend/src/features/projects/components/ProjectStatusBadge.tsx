/**
 * Project status badge component.
 *
 * Displays the project status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";

/**
 * Project status.
 */
export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Component properties.
 */
export interface ProjectStatusBadgeProps {
  /**
   * Project status.
   */
  readonly status: string;
}

/**
 * Returns badge configuration.
 *
 * @param status Project status.
 * @returns Badge configuration.
 */
function getStatusConfig(
  status: string,
): {
  readonly label: string;
  readonly className: string;
  readonly icon: React.JSX.Element;
} {
  switch (status.toUpperCase()) {
    case "PLANNING":
      return {
        label: "Planning",
        className:
          "border-blue-200 bg-blue-100 text-blue-700",
        icon: (
          <Clock3 size={16} />
        ),
      };

    case "ACTIVE":
      return {
        label: "Active",
        className:
          "border-green-200 bg-green-100 text-green-700",
        icon: (
          <PlayCircle size={16} />
        ),
      };

    case "ON_HOLD":
      return {
        label: "On Hold",
        className:
          "border-yellow-200 bg-yellow-100 text-yellow-700",
        icon: (
          <PauseCircle size={16} />
        ),
      };

    case "COMPLETED":
      return {
        label: "Completed",
        className:
          "border-emerald-200 bg-emerald-100 text-emerald-700",
        icon: (
          <CheckCircle2 size={16} />
        ),
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className:
          "border-red-200 bg-red-100 text-red-700",
        icon: (
          <XCircle size={16} />
        ),
      };

    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <PauseCircle size={16} />
        ),
      };
  }
}

/**
 * Project status badge.
 *
 * @param props Component properties.
 * @returns Project status badge.
 */
export function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps): React.JSX.Element {
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
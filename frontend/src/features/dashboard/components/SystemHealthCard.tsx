/**
 * System health card component.
 */

import type {
  SystemHealth,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface SystemHealthCardProps {
  /**
   * Current system health.
   */
  readonly health: SystemHealth;
}

/**
 * Returns badge classes for the overall health status.
 *
 * @param status - Health status.
 * @returns Tailwind CSS classes.
 */
function getStatusClasses(
  status: SystemHealth["status"],
): string {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-800";

    case "warning":
      return "bg-yellow-100 text-yellow-800";

    case "critical":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Returns a status badge.
 *
 * @param label - Service label.
 * @param healthy - Service state.
 * @returns Status badge.
 */
function StatusBadge({
  label,
  healthy,
}: {
  readonly label: string;
  readonly healthy: boolean;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
      <span className="text-sm text-gray-700">
        {label}
      </span>

      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          healthy
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {healthy
          ? "Online"
          : "Offline"}
      </span>
    </div>
  );
}

/**
 * System health card.
 *
 * @param props - Component properties.
 * @returns System health card component.
 */
export function SystemHealthCard({
  health,
}: SystemHealthCardProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            System Health
          </h2>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
              health.status,
            )}`}
          >
            {health.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <StatusBadge
          label="API"
          healthy={
            health.api
          }
        />

        <StatusBadge
          label="Database"
          healthy={
            health.database
          }
        />

        <StatusBadge
          label="AI Services"
          healthy={
            health.aiServices
          }
        />

        <StatusBadge
          label="Storage"
          healthy={
            health.storage
          }
        />

        <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
          Last updated{" "}
          {new Date(
            health.updatedAt,
          ).toLocaleString()}
        </div>
      </div>
    </section>
  );
}
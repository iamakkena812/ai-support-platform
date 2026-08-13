/**
 * Permission statistics.
 *
 * Displays high-level permission management metrics.
 */

import type { PermissionStatistics } from "../types/permission.types";

/**
 * Permission statistics component properties.
 */
export interface PermissionStatsProps {
  /**
   * Permission statistics.
   */
  readonly statistics: PermissionStatistics | null;

  /**
   * Loading state.
   */
  readonly isLoading?: boolean;
}

/**
 * Individual statistic card properties.
 */
interface StatisticItemProps {
  /**
   * Statistic label.
   */
  readonly label: string;

  /**
   * Statistic value.
   */
  readonly value: number;

  /**
   * Optional supporting text.
   */
  readonly description: string;
}

/**
 * Statistic item.
 *
 * @param props - Statistic properties.
 * @returns Statistic card.
 */
function StatisticItem({
  label,
  value,
  description,
}: StatisticItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

/**
 * Permission statistics.
 *
 * @param props - Component properties.
 * @returns Permission statistics cards.
 */
export function PermissionStats({
  statistics,
  isLoading = false,
}: PermissionStatsProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-label="Loading permission statistics"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        ))}

        <span className="sr-only">
          Loading permission statistics...
        </span>
      </div>
    );
  }

  if (statistics === null) {
    return null;
  }

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Permission statistics"
    >
      <StatisticItem
        label="Total Permissions"
        value={statistics.total}
        description="Permissions configured"
      />

      <StatisticItem
        label="Resources"
        value={statistics.resources}
        description="Distinct resources covered"
      />

      <StatisticItem
        label="Assigned"
        value={statistics.assigned}
        description="Permissions assigned to roles"
      />

      <StatisticItem
        label="Unassigned"
        value={statistics.unassigned}
        description="Permissions not assigned"
      />
    </section>
  );
}
/**
 * Permission summary.
 *
 * Displays a concise summary of the selected permission.
 */

import type { Permission } from "../types/permission.types";

/**
 * Permission summary properties.
 */
export interface PermissionSummaryProps {
  /**
   * Permission to summarize.
   */
  readonly permission: Permission | null;

  /**
   * Optional loading state.
   */
  readonly isLoading?: boolean;
}

/**
 * Permission summary.
 *
 * @param props - Component properties.
 * @returns Permission summary.
 */
export function PermissionSummary({
  permission,
  isLoading = false,
}: PermissionSummaryProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-white p-5"
        role="status"
        aria-label="Loading permission summary"
      >
        <div className="space-y-3">
          <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
        </div>

        <span className="sr-only">
          Loading permission summary...
        </span>
      </div>
    );
  }

  if (permission === null) {
    return null;
  }

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      aria-labelledby="permission-summary-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="permission-summary-title"
            className="truncate text-lg font-semibold text-gray-900"
          >
            {permission.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {permission.description ??
              "No description available."}
          </p>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-gray-100 px-3 py-1 font-mono text-xs font-medium text-gray-700">
          {permission.resource}:{permission.action}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <dl>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Identifier
            </dt>

            <dd className="mt-1 break-all font-mono text-xs text-gray-700">
              {permission.id}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
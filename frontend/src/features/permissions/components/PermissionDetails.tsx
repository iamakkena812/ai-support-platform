/**
 * Permission details.
 *
 * Displays detailed information about a permission.
 */

import type { Permission } from "../types/permission.types";

/**
 * Permission details properties.
 */
export interface PermissionDetailsProps {
  /**
   * Permission to display.
   */
  readonly permission: Permission | null;

  /**
   * Optional loading state.
   */
  readonly isLoading?: boolean;
}

/**
 * Permission details.
 *
 * @param props - Component properties.
 * @returns Permission details.
 */
export function PermissionDetails({
  permission,
  isLoading = false,
}: PermissionDetailsProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-white p-6"
        role="status"
        aria-label="Loading permission"
      >
        <div className="space-y-4">
          <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (permission === null) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-gray-500">
          Permission not found.
        </p>
      </div>
    );
  }

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      aria-labelledby="permission-details-title"
    >
      <div className="border-b border-gray-100 pb-4">
        <h2
          id="permission-details-title"
          className="text-lg font-semibold text-gray-900"
        >
          {permission.name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Permission details
        </p>
      </div>

      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Permission ID
          </dt>

          <dd className="mt-1 break-all font-mono text-sm text-gray-900">
            {permission.id}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Name
          </dt>

          <dd className="mt-1 text-sm text-gray-900">
            {permission.name}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Resource
          </dt>

          <dd className="mt-1 font-mono text-sm text-gray-900">
            {permission.resource}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Action
          </dt>

          <dd className="mt-1 font-mono text-sm text-gray-900">
            {permission.action}
          </dd>
        </div>

        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Description
          </dt>

          <dd className="mt-1 text-sm text-gray-700">
            {permission.description ?? "No description available."}
          </dd>
        </div>
      </dl>
    </section>
  );
}
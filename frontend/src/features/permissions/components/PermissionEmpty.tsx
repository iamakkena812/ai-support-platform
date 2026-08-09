/**
 * Permission empty state.
 *
 * Displays a consistent empty state when no permissions
 * are available or match the current filters.
 */

import { Link } from "react-router-dom";

/**
 * Permission empty state properties.
 */
export interface PermissionEmptyProps {
  /**
   * Indicates whether filters are currently applied.
   */
  readonly hasFilters?: boolean;

  /**
   * Whether the current user can create permissions.
   */
  readonly canCreate?: boolean;

  /**
   * Optional callback for clearing filters.
   */
  readonly onClearFilters?: () => void;
}

/**
 * Permission empty state.
 *
 * @param props - Component properties.
 * @returns Permission empty state.
 */
export function PermissionEmpty({
  hasFilters = false,
  canCreate = false,
  onClearFilters,
}: PermissionEmptyProps) {
  if (hasFilters) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-gray-900">
          No permissions found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          No permissions match the current search or filters.
        </p>

        {onClearFilters !== undefined && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
      <h3 className="text-base font-semibold text-gray-900">
        No permissions yet
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Create your first permission to start managing
        access controls.
      </p>

      {canCreate && (
        <Link
          to="/permissions/create"
          className="mt-5 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Create Permission
        </Link>
      )}
    </div>
  );
}
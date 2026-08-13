/**
 * Permission filters.
 *
 * Provides search and filtering controls for the
 * Permissions feature. All three filters map directly to
 * real backend query params (search, resource, action).
 */

import type { PermissionFilterValues } from "../types/permission.types";

/**
 * Permission filter properties.
 */
export interface PermissionFiltersProps {
  /**
   * Current filter values.
   */
  readonly filters: PermissionFilterValues;

  /**
   * Called when filter values change.
   */
  readonly onChange: (
    filters: PermissionFilterValues,
  ) => void;

  /**
   * Optional callback to clear all filters.
   */
  readonly onClear?: () => void;
}

/**
 * Permission filters.
 *
 * @param props - Component properties.
 * @returns Permission filter controls.
 */
export function PermissionFilters({
  filters,
  onChange,
  onClear,
}: PermissionFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.resource) ||
    Boolean(filters.action);

  const updateFilter = (
    key: keyof PermissionFilterValues,
    value: string,
  ) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      aria-label="Permission filters"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="permission-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search
          </label>

          <input
            id="permission-search"
            type="search"
            value={filters.search ?? ""}
            onChange={(event) => {
              updateFilter(
                "search",
                event.target.value,
              );
            }}
            placeholder="Search permissions..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="permission-resource"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Resource
          </label>

          <input
            id="permission-resource"
            type="text"
            value={filters.resource ?? ""}
            onChange={(event) => {
              updateFilter(
                "resource",
                event.target.value,
              );
            }}
            placeholder="e.g. ticket"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="permission-action"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Action
          </label>

          <input
            id="permission-action"
            type="text"
            value={filters.action ?? ""}
            onChange={(event) => {
              updateFilter(
                "action",
                event.target.value,
              );
            }}
            placeholder="e.g. create"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {hasFilters && onClear !== undefined && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus:outline-none focus:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

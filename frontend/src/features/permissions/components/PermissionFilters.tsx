/**
 * Permission filters.
 *
 * Provides search and filtering controls for the
 * Permissions feature.
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

  /**
   * Permission groups available for filtering.
   */
  readonly groups?: readonly {
    readonly id: string;
    readonly name: string;
  }[];
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
  groups = [],
}: PermissionFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.groupId) ||
    Boolean(filters.resource);

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
            htmlFor="permission-group"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Permission group
          </label>

          <select
            id="permission-group"
            value={filters.groupId ?? ""}
            onChange={(event) => {
              updateFilter(
                "groupId",
                event.target.value,
              );
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">
              All groups
            </option>

            {groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>
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
            placeholder="e.g. tickets"
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
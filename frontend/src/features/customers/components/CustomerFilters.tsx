/**
 * Customer filters component.
 */

import {
  useState,
} from "react";

interface CustomerFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Active status filter.
   */
  readonly isActive?: boolean;

  /**
   * Search change handler.
   */
  readonly onSearchChange: (
    value: string,
  ) => void;

  /**
   * Status change handler.
   */
  readonly onStatusChange: (
    value: boolean | undefined,
  ) => void;

  /**
   * Reset filters handler.
   */
  readonly onReset: () => void;
}

/**
 * Customer filters.
 */
export function CustomerFilters({
  search,
  isActive,
  onSearchChange,
  onStatusChange,
  onReset,
}: CustomerFiltersProps): React.JSX.Element {
  const [searchValue, setSearchValue] =
    useState(search);

  const handleSearch = (
    value: string,
  ): void => {
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            value={searchValue}
            placeholder="Search customers..."
            onChange={(event) =>
              handleSearch(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={
              isActive === undefined
                ? ""
                : String(isActive)
            }
            onChange={(event) => {
              const value =
                event.target.value;

              if (value === "") {
                onStatusChange(
                  undefined,
                );

                return;
              }

              onStatusChange(
                value === "true",
              );
            }}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All
            </option>

            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}
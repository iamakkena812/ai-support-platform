/**
 * Project filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  ProjectStatus,
} from "../types/project.types";

/**
 * Project filter values.
 */
export interface ProjectFiltersValues {
  /**
   * Project name.
   */
  readonly search: string;

  /**
   * Project status.
   */
  readonly status: ProjectStatus | "";

  /**
   * Customer identifier.
   */
  readonly customerId: string;

  /**
   * Owner identifier.
   */
  readonly ownerId: string;
}

interface ProjectFiltersProps {
  /**
   * Current filter values.
   */
  readonly value: ProjectFiltersValues;

  /**
   * Filter change handler.
   */
  readonly onChange: (
    values: ProjectFiltersValues,
  ) => void;
}

/**
 * Project filters.
 */
export function ProjectFilters({
  value,
  onChange,
}: ProjectFiltersProps): React.JSX.Element {
  const [filters, setFilters] =
    useState(value);

  useEffect(() => {
    setFilters(value);
  }, [value]);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            placeholder="Project name..."
            value={filters.search}
            onChange={(event) =>
              setFilters({
                ...filters,
                search:
                  event.target.value,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={filters.status}
            onChange={(event) =>
              setFilters({
                ...filters,
                status:
                  event.target
                    .value as ProjectStatus | "",
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All Statuses
            </option>

            <option value="planning">
              Planning
            </option>

            <option value="active">
              Active
            </option>

            <option value="on_hold">
              On Hold
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer ID
          </label>

          <input
            type="text"
            placeholder="Customer ID"
            value={filters.customerId}
            onChange={(event) =>
              setFilters({
                ...filters,
                customerId:
                  event.target.value,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Owner ID
          </label>

          <input
            type="text"
            placeholder="Owner ID"
            value={filters.ownerId}
            onChange={(event) =>
              setFilters({
                ...filters,
                ownerId:
                  event.target.value,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setFilters({
              search: "",
              status: "",
              customerId: "",
              ownerId: "",
            })
          }
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
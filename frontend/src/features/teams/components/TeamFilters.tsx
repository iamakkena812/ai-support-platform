/**
 * Team filters component.
 */

import { Search } from "lucide-react";

export interface TeamFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Status value.
   */
  readonly status: string;

  /**
   * Search callback.
   */
  readonly onSearchChange: (
    value: string,
  ) => void;

  /**
   * Status callback.
   */
  readonly onStatusChange: (
    value: string,
  ) => void;
}

/**
 * Team filters.
 */
export function TeamFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TeamFiltersProps): React.JSX.Element {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search teams..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">
          All Teams
        </option>

        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>
    </div>
  );
}
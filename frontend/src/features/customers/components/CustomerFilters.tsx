/**
 * Customer filters component.
 *
 * Displays search and filter controls
 * for the customers list.
 */

import {
  Funnel,
  Search,
} from "lucide-react";

import {
  Input,
  Select,
} from "../../../components/ui";

/**
 * Select option.
 */
export interface CustomerFilterOption {
  /**
   * Option label.
   */
  readonly label: string;

  /**
   * Option value.
   */
  readonly value: string;
}

/**
 * Component properties.
 */
export interface CustomerFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Status filter.
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
 * Status options.
 */
const STATUS_OPTIONS: readonly CustomerFilterOption[] = [
  {
    label: "All Statuses",
    value: "",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Suspended",
    value: "suspended",
  },
];

/**
 * Customer filters component.
 *
 * @param props Component properties.
 * @returns Customer filters.
 */
export function CustomerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: CustomerFiltersProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Funnel
          size={20}
          className="text-slate-600"
        />

        <h2 className="font-semibold text-slate-900">
          Filters
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            className="pl-10"
          />
        </div>

        <Select
          value={status}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
          onChange={(event) =>
            onStatusChange(
              event.target.value,
            )
          }
        />
      </div>
    </section>
  );
}

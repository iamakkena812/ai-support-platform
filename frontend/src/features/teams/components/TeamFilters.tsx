/**
 * Team filters component.
 *
 * Displays search and filter controls
 * for the teams list.
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
export interface TeamFilterOption {
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
export interface TeamFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Organization filter.
   */
  readonly organizationId: string;

  /**
   * Status filter.
   */
  readonly status: string;

  /**
   * Organization options.
   */
  readonly organizations: readonly TeamFilterOption[];

  /**
   * Search callback.
   */
  readonly onSearchChange: (
    value: string,
  ) => void;

  /**
   * Organization callback.
   */
  readonly onOrganizationChange: (
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
const STATUS_OPTIONS: readonly TeamFilterOption[] = [
  {
    label: "All Statuses",
    value: "",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Archived",
    value: "ARCHIVED",
  },
];

/**
 * Team filters component.
 *
 * @param props Component properties.
 * @returns Team filters.
 */
export function TeamFilters({
  search,
  organizationId,
  status,
  organizations,
  onSearchChange,
  onOrganizationChange,
  onStatusChange,
}: TeamFiltersProps): React.JSX.Element {
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search teams..."
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
          value={organizationId}
          placeholder="All Organizations"
          options={organizations}
          onChange={(event) =>
            onOrganizationChange(
              event.target.value,
            )
          }
        />

        <Select
          value={status}
          placeholder="All Statuses"
          options={STATUS_OPTIONS}
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
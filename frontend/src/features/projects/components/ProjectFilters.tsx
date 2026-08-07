/**
 * Project filters component.
 *
 * Displays search and filter controls
 * for the projects list.
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
export interface ProjectFilterOption {
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
export interface ProjectFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Organization filter.
   */
  readonly organizationId: string;

  /**
   * Team filter.
   */
  readonly teamId: string;

  /**
   * Status filter.
   */
  readonly status: string;

  /**
   * Organization options.
   */
  readonly organizations: readonly ProjectFilterOption[];

  /**
   * Team options.
   */
  readonly teams: readonly ProjectFilterOption[];

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
   * Team callback.
   */
  readonly onTeamChange: (
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
const STATUS_OPTIONS: readonly ProjectFilterOption[] = [
  {
    label: "All Statuses",
    value: "",
  },
  {
    label: "Planning",
    value: "PLANNING",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "On Hold",
    value: "ON_HOLD",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

/**
 * Project filters component.
 *
 * @param props Component properties.
 * @returns Project filters component.
 */
export function ProjectFilters({
  search,
  organizationId,
  teamId,
  status,
  organizations,
  teams,
  onSearchChange,
  onOrganizationChange,
  onTeamChange,
  onStatusChange,
}: ProjectFiltersProps): React.JSX.Element {
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search projects..."
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
          options={organizations}
          placeholder="All Organizations"
          onChange={(event) =>
            onOrganizationChange(
              event.target.value,
            )
          }
        />

        <Select
          value={teamId}
          options={teams}
          placeholder="All Teams"
          onChange={(event) =>
            onTeamChange(
              event.target.value,
            )
          }
        />

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
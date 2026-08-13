/**
 * Ticket filters component.
 *
 * Displays search and filter controls
 * for the tickets list.
 */

import {
  useState,
} from "react";

import {
  Filter,
  Search,
} from "lucide-react";

import {
  Input,
  Select,
} from "../../../components/ui";

import type {
  TicketQueryFilters,
} from "../types/ticket.types";


/**
 * Select option.
 */
export interface TicketFilterOption {

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
export interface TicketFiltersProps {

  /**
   * Initial filter values.
   */
  readonly initialValue?: TicketQueryFilters;


  /**
   * Filter change callback.
   */
  readonly onChange?: (
    filters: TicketQueryFilters,
  ) => void;
}


/**
 * Status options.
 */
const STATUS_OPTIONS: readonly TicketFilterOption[] = [
  {
    label: "All Statuses",
    value: "",
  },
  {
    label: "Open",
    value: "open",
  },
  {
    label: "In Progress",
    value: "in_progress",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "Closed",
    value: "closed",
  },
];


/**
 * Priority options.
 */
const PRIORITY_OPTIONS: readonly TicketFilterOption[] = [
  {
    label: "All Priorities",
    value: "",
  },
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
  {
    label: "Critical",
    value: "critical",
  },
];


/**
 * Ticket filters component.
 *
 * @param props Component properties.
 * @returns Ticket filters.
 */
export function TicketFilters({
  initialValue,
  onChange,
}: TicketFiltersProps): React.JSX.Element {

  const [
    filters,
    setFilters,
  ] = useState<TicketQueryFilters>(
    initialValue ?? {},
  );


  function updateFilters(
    value: TicketQueryFilters,
  ): void {

    const updated = {
      ...filters,
      ...value,
    };

    setFilters(updated);

    onChange?.(
      updated,
    );
  }


  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">

      <div className="mb-4 flex items-center gap-2">

        <Filter
          size={18}
          className="text-slate-600"
        />

        <h2 className="font-semibold text-slate-900">
          Filters
        </h2>

      </div>


      <div className="grid gap-4 md:grid-cols-3">


        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-3 text-slate-400"
          />

          <Input
            placeholder="Search tickets..."
            value={
              filters.search ?? ""
            }
            onChange={(event) =>
              updateFilters({
                search:
                  event.target.value,
              })
            }
            className="pl-10"
          />

        </div>


        <Select
          value={
            filters.status ?? ""
          }
          options={
            STATUS_OPTIONS
          }
          placeholder="All Statuses"
          onChange={(event) =>
            updateFilters({
              status:
                event.target.value
                  ? event.target.value as TicketQueryFilters["status"]
                  : undefined,
            })
          }
        />


        <Select
          value={
            filters.priority ?? ""
          }
          options={
            PRIORITY_OPTIONS
          }
          placeholder="All Priorities"
          onChange={(event) =>
            updateFilters({
              priority:
                event.target.value
                  ? event.target.value as TicketQueryFilters["priority"]
                  : undefined,
            })
          }
        />

      </div>

    </section>
  );
}

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
    value: "OPEN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Waiting",
    value: "WAITING",
  },
  {
    label: "Resolved",
    value: "RESOLVED",
  },
  {
    label: "Closed",
    value: "CLOSED",
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
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
  {
    label: "Urgent",
    value: "URGENT",
  },
];


/**
 * Type options.
 */
const TYPE_OPTIONS: readonly TicketFilterOption[] = [
  {
    label: "All Types",
    value: "",
  },
  {
    label: "Incident",
    value: "incident",
  },
  {
    label: "Service Request",
    value: "service_request",
  },
  {
    label: "Bug",
    value: "bug",
  },
  {
    label: "Task",
    value: "task",
  },
  {
    label: "Question",
    value: "question",
  },
  {
    label: "Feature Request",
    value: "feature_request",
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


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


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


        <Select
          value={
            filters.type ?? ""
          }
          options={
            TYPE_OPTIONS
          }
          placeholder="All Types"
          onChange={(event) =>
            updateFilters({
              type:
                event.target.value
                  ? event.target.value as TicketQueryFilters["type"]
                  : undefined,
            })
          }
        />

      </div>

    </section>
  );
}
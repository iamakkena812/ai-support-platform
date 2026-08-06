/**
 * Ticket filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  TicketFilterValues,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "../types/ticket.types";

/**
 * Component properties.
 */
export interface TicketFiltersProps {
  /**
   * Initial filter values.
   */
  readonly initialValue?: TicketFilterValues;

  /**
   * Filter change handler.
   */
  readonly onChange: (
    filters: TicketFilterValues,
  ) => void;
}

/**
 * Ticket filters.
 */
export function TicketFilters({
  initialValue,
  onChange,
}: TicketFiltersProps): React.JSX.Element {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<TicketStatus | "">("");

  const [priority, setPriority] =
    useState<TicketPriority | "">("");

  const [type, setType] =
    useState<TicketType | "">("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setSearch(
      initialValue.search ?? "",
    );

    setStatus(
      initialValue.status ?? "",
    );

    setPriority(
      initialValue.priority ?? "",
    );

    setType(
      initialValue.type ?? "",
    );
  }, [initialValue]);

  useEffect(() => {
    onChange({
      search:
        search.trim() === ""
          ? undefined
          : search,
      status:
        status === ""
          ? undefined
          : status,
      priority:
        priority === ""
          ? undefined
          : priority,
      type:
        type === ""
          ? undefined
          : type,
    });
  }, [
    search,
    status,
    priority,
    type,
    onChange,
  ]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(event) =>
              setSearch(
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
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as TicketStatus | "",
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All
            </option>

            <option value="new">
              New
            </option>

            <option value="open">
              Open
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="resolved">
              Resolved
            </option>

            <option value="closed">
              Closed
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as TicketPriority | "",
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All
            </option>

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

            <option value="urgent">
              Urgent
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target
                  .value as TicketType | "",
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All
            </option>

            <option value="incident">
              Incident
            </option>

            <option value="service_request">
              Service Request
            </option>

            <option value="bug">
              Bug
            </option>

            <option value="task">
              Task
            </option>

            <option value="question">
              Question
            </option>

            <option value="feature_request">
              Feature Request
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
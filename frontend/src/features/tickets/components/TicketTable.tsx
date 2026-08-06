/**
 * Ticket table component.
 *
 * Displays a collection of tickets in a responsive table.
 */

import type { FC } from "react";

import type { Ticket } from "../types/ticket.types";

/**
 * Ticket table component properties.
 */
export interface TicketTableProps {
  /**
   * Collection of tickets.
   */
  tickets: readonly Ticket[];

  /**
   * Invoked when a ticket is selected.
   */
  onView?: (ticket: Ticket) => void;

  /**
   * Invoked when editing a ticket.
   */
  onEdit?: (ticket: Ticket) => void;

  /**
   * Invoked when deleting a ticket.
   */
  onDelete?: (ticket: Ticket) => void;
}

/**
 * Returns badge classes for the ticket status.
 *
 * @param status - Ticket status.
 * @returns CSS classes.
 */
const getStatusClassName = (
  status: Ticket["status"],
): string => {
  switch (status) {
    case "new":
      return "bg-slate-100 text-slate-800";

    case "open":
      return "bg-blue-100 text-blue-800";

    case "in_progress":
      return "bg-indigo-100 text-indigo-800";

    case "pending":
      return "bg-yellow-100 text-yellow-800";

    case "resolved":
      return "bg-green-100 text-green-800";

    case "closed":
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Returns badge classes for the ticket priority.
 *
 * @param priority - Ticket priority.
 * @returns CSS classes.
 */
const getPriorityClassName = (
  priority: Ticket["priority"],
): string => {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800";

    case "medium":
      return "bg-yellow-100 text-yellow-800";

    case "high":
      return "bg-orange-100 text-orange-800";

    case "urgent":
      return "bg-red-100 text-red-800";
  }
};

/**
 * Ticket table.
 *
 * @param props - Component properties.
 * @returns Ticket table.
 */
export const TicketTable: FC<TicketTableProps> = ({
  tickets,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Ticket
          </th>

          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Customer
          </th>

          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Assignee
          </th>

          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Status
          </th>

          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Priority
          </th>

          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            Updated
          </th>

          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 bg-white">
        {tickets.length === 0 ? (
          <tr>
            <td
              className="px-4 py-8 text-center text-sm text-gray-500"
              colSpan={7}
            >
              No tickets found.
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {ticket.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    {ticket.ticketNumber}
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {ticket.customer?.name ?? "—"}
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {ticket.assignee?.name ?? "Unassigned"}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                    ticket.status,
                  )}`}
                >
                  {ticket.status.replaceAll("_", " ")}
                </span>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClassName(
                    ticket.priority,
                  )}`}
                >
                  {ticket.priority}
                </span>
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {new Date(
                  ticket.updatedAt,
                ).toLocaleDateString()}
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                    type="button"
                    onClick={() => onView?.(ticket)}
                  >
                    View
                  </button>

                  <button
                    className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                    type="button"
                    onClick={() => onEdit?.(ticket)}
                  >
                    Edit
                  </button>

                  <button
                    className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                    type="button"
                    onClick={() => onDelete?.(ticket)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
/**
 * Ticket card component.
 *
 * Displays a summary of a ticket in a responsive card layout.
 */

import type { FC } from "react";

import type { Ticket } from "../types/ticket.types";

/**
 * Component properties.
 */
export interface TicketCardProps {
  /**
   * Ticket to display.
   */
  ticket: Ticket;

  /**
   * Invoked when the card is selected.
   */
  onClick?: (ticket: Ticket) => void;
}

/**
 * Returns Tailwind classes for the ticket priority badge.
 *
 * @param priority - Ticket priority.
 * @returns CSS classes.
 */
const getPriorityClasses = (
  priority: Ticket["priority"],
): string => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700";

    case "high":
      return "bg-orange-100 text-orange-700";

    case "medium":
      return "bg-yellow-100 text-yellow-700";

    case "low":
    default:
      return "bg-green-100 text-green-700";
  }
};

/**
 * Returns Tailwind classes for the ticket status badge.
 *
 * @param status - Ticket status.
 * @returns CSS classes.
 */
const getStatusClasses = (
  status: Ticket["status"],
): string => {
  switch (status) {
    case "new":
      return "bg-slate-100 text-slate-700";

    case "open":
      return "bg-blue-100 text-blue-700";

    case "in_progress":
      return "bg-indigo-100 text-indigo-700";

    case "pending":
      return "bg-amber-100 text-amber-700";

    case "resolved":
      return "bg-emerald-100 text-emerald-700";

    case "closed":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

/**
 * Ticket summary card.
 *
 * @param props - Component properties.
 * @returns Ticket card component.
 */
export const TicketCard: FC<TicketCardProps> = ({
  ticket,
  onClick,
}) => (
  <div
    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={() => onClick?.(ticket)}
    onKeyDown={(event) => {
      if (
        onClick &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        onClick(ticket);
      }
    }}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {ticket.ticketNumber}
        </p>

        <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
          {ticket.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {ticket.description}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
          ticket.priority,
        )}`}
      >
        {ticket.priority}
      </span>
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
          ticket.status,
        )}`}
      >
        {ticket.status.replaceAll("_", " ")}
      </span>

      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {ticket.type.replaceAll("_", " ")}
      </span>
    </div>

    <div className="mt-5 space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Customer:</span>{" "}
        {ticket.customer?.name ?? "—"}
      </p>

      <p>
        <span className="font-medium">Project:</span>{" "}
        {ticket.project?.name ?? "—"}
      </p>

      <p>
        <span className="font-medium">Assignee:</span>{" "}
        {ticket.assignee?.name ?? "Unassigned"}
      </p>
    </div>

    <div className="mt-5 border-t pt-3 text-xs text-gray-500">
      Updated{" "}
      {new Date(ticket.updatedAt).toLocaleDateString()}
    </div>
  </div>
);
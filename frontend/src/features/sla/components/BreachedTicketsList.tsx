/**
 * Breached SLA tickets list component.
 */

import type { FC } from "react";

import type { BreachedTicket } from "../types/sla.types";

/**
 * Component properties.
 */
export interface BreachedTicketsListProps {
  /**
   * Breached tickets.
   */
  readonly tickets: readonly BreachedTicket[];
}

/**
 * Breached SLA tickets list.
 *
 * @param props - Component properties.
 * @returns Breached tickets list component.
 */
export const BreachedTicketsList: FC<BreachedTicketsListProps> = ({
  tickets,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        No breached SLAs.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tickets.map((ticket) => (
        <li
          key={ticket.ticketId}
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm"
        >
          <span className="font-medium text-red-800">
            Ticket {ticket.ticketId}
          </span>

          <span className="flex gap-2 text-xs text-red-700">
            {ticket.firstResponseBreached ? (
              <span className="rounded-full border border-red-300 bg-white px-2 py-0.5">
                First response breached
              </span>
            ) : null}

            {ticket.resolutionBreached ? (
              <span className="rounded-full border border-red-300 bg-white px-2 py-0.5">
                Resolution breached
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
};

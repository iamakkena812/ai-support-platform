/**
 * Recent tickets component.
 */

import type {
  DashboardTicket,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface RecentTicketsProps {
  /**
   * Recent tickets.
   */
  readonly tickets: readonly DashboardTicket[];
}

/**
 * Returns badge classes for a ticket status.
 *
 * @param status - Ticket status.
 * @returns Tailwind CSS classes.
 */
function getStatusClasses(
  status: string,
): string {
  switch (
    status.toLowerCase()
  ) {
    case "open":
      return "bg-blue-100 text-blue-800";

    case "in_progress":
    case "in progress":
      return "bg-yellow-100 text-yellow-800";

    case "resolved":
      return "bg-green-100 text-green-800";

    case "closed":
      return "bg-gray-100 text-gray-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Returns badge classes for a ticket priority.
 *
 * @param priority - Ticket priority.
 * @returns Tailwind CSS classes.
 */
function getPriorityClasses(
  priority: string,
): string {
  switch (
    priority.toLowerCase()
  ) {
    case "critical":
      return "bg-red-100 text-red-800";

    case "high":
      return "bg-orange-100 text-orange-800";

    case "medium":
      return "bg-yellow-100 text-yellow-800";

    case "low":
      return "bg-green-100 text-green-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Recent tickets.
 *
 * @param props - Component properties.
 * @returns Recent tickets component.
 */
export function RecentTickets({
  tickets,
}: RecentTicketsProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Tickets
        </h2>
      </div>

      {tickets.length ===
      0 ? (
        <div className="p-8 text-center text-gray-500">
          No recent tickets.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {tickets.map(
            (
              ticket,
            ) => (
              <div
                key={
                  ticket.id
                }
                className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {
                        ticket.ticketNumber
                      }
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                        ticket.status,
                      )}`}
                    >
                      {
                        ticket.status
                      }
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClasses(
                        ticket.priority,
                      )}`}
                    >
                      {
                        ticket.priority
                      }
                    </span>
                  </div>

                  <p className="mt-2 truncate text-sm text-gray-700">
                    {
                      ticket.title
                    }
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(
                    ticket.createdAt,
                  ).toLocaleDateString()}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
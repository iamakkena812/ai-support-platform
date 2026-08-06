/**
 * Ticket details page.
 */

import { useParams } from "react-router-dom";

import { useTicket } from "../hooks/useTicket";

/**
 * Ticket details page.
 */
export function TicketDetailsPage(): React.JSX.Element {
  const { ticketId = "" } = useParams<{
    ticketId: string;
  }>();

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useTicket(ticketId);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading ticket...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load the ticket."}
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Ticket not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {ticket.ticketNumber}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {ticket.title}
            </h1>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {ticket.status.replaceAll("_", " ")}
            </span>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {ticket.priority}
            </span>
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Description
        </h2>

        <p className="whitespace-pre-wrap text-gray-700">
          {ticket.description}
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Ticket Information
        </h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Type
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.type.replaceAll("_", " ")}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Customer
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.customer?.name ??
                "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Project
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.project?.name ??
                "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Assignee
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.assignee?.name ??
                "Unassigned"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Created
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                ticket.createdAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Updated
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                ticket.updatedAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Resolved
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.resolvedAt
                ? new Date(
                    ticket.resolvedAt,
                  ).toLocaleString()
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Closed
            </dt>

            <dd className="mt-1 text-gray-900">
              {ticket.closedAt
                ? new Date(
                    ticket.closedAt,
                  ).toLocaleString()
                : "—"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
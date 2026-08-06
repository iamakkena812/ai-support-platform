/**
 * Tickets page.
 */

import {
  useMemo,
  useState,
} from "react";

import {
  TicketFilters,
} from "../components/TicketFilters";
import {
  TicketTable,
} from "../components/TicketTable";
import {
  useTickets,
} from "../hooks/useTickets";

import type {
  Ticket,
  TicketFilterValues,
} from "../types/ticket.types";

/**
 * Tickets page.
 */
export function TicketsPage(): React.JSX.Element {
  const [filters, setFilters] =
    useState<TicketFilterValues>({});

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 10,
      filters,
    }),
    [filters],
  );

  const {
    data,
    isLoading,
    isError,
    error,
  } = useTickets(query);

  const handleView = (
    ticket: Ticket,
  ): void => {
    console.info(
      "View ticket",
      ticket.id,
    );
  };

  const handleEdit = (
    ticket: Ticket,
  ): void => {
    console.info(
      "Edit ticket",
      ticket.id,
    );
  };

  const handleDelete = (
    ticket: Ticket,
  ): void => {
    console.info(
      "Delete ticket",
      ticket.id,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tickets
          </h1>

          <p className="mt-1 text-gray-600">
            View and manage support
            tickets.
          </p>
        </div>

        <button
          type="button"
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Create Ticket
        </button>
      </div>

      <TicketFilters
        initialValue={filters}
        onChange={setFilters}
      />

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading tickets...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load tickets."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <TicketTable
          tickets={
            data?.items ?? []
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      ) : null}
    </div>
  );
}
/**
 * Tickets page.
 */

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  isAxiosError,
} from "axios";

import {
  DeleteTicketDialog,
} from "../components/DeleteTicketDialog";
import {
  TicketFilters,
} from "../components/TicketFilters";
import {
  TicketTable,
} from "../components/TicketTable";
import {
  useDeleteTicket,
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
  const navigate =
    useNavigate();

  const [filters, setFilters] =
    useState<TicketFilterValues>({});

  const [pendingDelete, setPendingDelete] =
    useState<Ticket | null>(null);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 20,
    }),
    [],
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useTickets({ filters: query });

  const deleteTicketMutation =
    useDeleteTicket();

  const tickets = useMemo(
    () => {
      const items =
        data?.items ?? [];

      return items.filter((ticket) => {
        const matchesSearch =
          !filters.search ||
          ticket.title
            .toLowerCase()
            .includes(
              filters.search.toLowerCase(),
            );

        const matchesStatus =
          !filters.status ||
          ticket.status === filters.status;

        const matchesPriority =
          !filters.priority ||
          ticket.priority === filters.priority;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      });
    },
    [data, filters],
  );

  const handleView = (
    ticket: Ticket,
  ): void => {
    navigate(`/tickets/${ticket.id}`);
  };

  const handleEdit = (
    ticket: Ticket,
  ): void => {
    navigate(`/tickets/${ticket.id}/edit`);
  };

  const handleDelete = (
    ticket: Ticket,
  ): void => {
    setDeleteError(null);
    setPendingDelete(ticket);
  };

  const handleConfirmDelete = async (
    ticket: Ticket,
  ): Promise<void> => {
    try {
      await deleteTicketMutation.mutateAsync(
        ticket.id,
      );

      setPendingDelete(null);
    } catch (deleteErr) {
      setDeleteError(
        isAxiosError(deleteErr) &&
          deleteErr.response?.status === 404
          ? "Ticket was already deleted."
          : "Failed to delete ticket. Please try again.",
      );

      throw deleteErr;
    }
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
          onClick={() =>
            navigate("/tickets/create")
          }
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
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <span>
            {isAxiosError(error) &&
            error.response?.status === 403
              ? "You do not have permission to view tickets."
              : error instanceof Error
                ? error.message
                : "Failed to load tickets."}
          </span>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded border border-red-300 px-3 py-1 text-sm hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {deleteError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteError}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <TicketTable
          tickets={tickets}
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

      {pendingDelete ? (
        <DeleteTicketDialog
          ticket={pendingDelete}
          isOpen={pendingDelete !== null}
          isDeleting={
            deleteTicketMutation.isPending
          }
          onClose={() => {
            setPendingDelete(null);
          }}
          onConfirm={
            handleConfirmDelete
          }
        />
      ) : null}
    </div>
  );
}

/**
 * React Query hooks for ticket collection operations.
 *
 * Provides hooks for listing, creating, updating,
 * deleting, and retrieving ticket statistics.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ticketQueryKeys } from "./useTicket";
import { ticketService } from "../services/ticket.service";

import type {
  CreateTicketRequest,
  Ticket,
  TicketListQuery,
  TicketListResponse,
  TicketStatistics,
  UpdateTicketRequest,
} from "../types/ticket.types";

/**
 * Statistics query key.
 */
const ticketStatisticsQueryKey = [
  ...ticketQueryKeys.all,
  "statistics",
] as const;

/**
 * Retrieves a paginated list of tickets.
 *
 * @param query - Ticket list query.
 * @returns React Query result.
 */
export const useTickets = (
  query?: TicketListQuery,
) =>
  useQuery<TicketListResponse>({
    queryKey: [...ticketQueryKeys.all, "list", query] as const,
    queryFn: () => ticketService.getTickets(query),
  });

/**
 * Retrieves ticket statistics.
 *
 * @returns React Query result.
 */
export const useTicketStatistics = () =>
  useQuery<TicketStatistics>({
    queryKey: ticketStatisticsQueryKey,
    queryFn: () => ticketService.getTicketStatistics(),
  });

/**
 * Creates a ticket.
 *
 * @returns Mutation.
 */
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (payload) =>
      ticketService.createTicket(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketQueryKeys.all,
      });
    },
  });
};

/**
 * Update ticket variables.
 */
interface UpdateTicketVariables {
  /**
   * Ticket identifier.
   */
  ticketId: string;

  /**
   * Update payload.
   */
  payload: UpdateTicketRequest;
}

/**
 * Updates a ticket.
 *
 * @returns Mutation.
 */
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Ticket,
    Error,
    UpdateTicketVariables
  >({
    mutationFn: ({ ticketId, payload }) =>
      ticketService.updateTicket(ticketId, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ticketQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ticketQueryKeys.detail(
            variables.ticketId,
          ),
        }),
      ]);
    },
  });
};

/**
 * Deletes a ticket.
 *
 * @returns Mutation.
 */
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (ticketId) =>
      ticketService.deleteTicket(ticketId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketQueryKeys.all,
      });
    },
  });
};
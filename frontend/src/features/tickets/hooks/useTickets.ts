/**
 * Tickets query hook.
 *
 * Provides ticket list
 * fetching functionality.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ticketService,
} from "../services/ticket.service";

import type {
  CreateTicketPayload,
  UpdateTicketPayload,
  TicketListResponse,
  TicketQueryFilters,
} from "../types/ticket.types";

/**
 * Tickets query key.
 */
const TICKETS_QUERY_KEY =
  "tickets";


/**
 * Use tickets hook options.
 */
export interface UseTicketsOptions {

  /**
   * Ticket filters.
   */
  readonly filters?: TicketQueryFilters;
}


/**
 * Use tickets hook.
 *
 * @param options Query options.
 * @returns Tickets query result.
 */
export function useTickets(
  options?: UseTicketsOptions,
) {
  return useQuery<TicketListResponse>({
    queryKey: [
      TICKETS_QUERY_KEY,
      options?.filters,
    ],

    queryFn: async () =>
      ticketService.getTickets(
        options?.filters,
      ),
  });
}

/**
 * Create ticket mutation hook.
 */
export function useCreateTicket() {

  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      (payload: CreateTicketPayload) =>
        ticketService.createTicket(
          payload,
        ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "tickets",
        ],
      });
    },
  });
}

/**
 * Update ticket mutation hook.
 */
export function useUpdateTicket() {

  const queryClient =
    useQueryClient();


  return useMutation({
    mutationFn:
      ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateTicketPayload;
      }) =>
        ticketService.updateTicket(
          id,
          payload,
        ),


    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "tickets",
        ],
      });
    },
  });
}
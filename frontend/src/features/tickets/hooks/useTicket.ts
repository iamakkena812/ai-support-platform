/**
 * Single ticket query hook.
 *
 * Provides ticket details
 * fetching functionality.
 */

import {
  useQuery,
} from "@tanstack/react-query";

import {
  ticketService,
} from "../services/ticket.service";

import type {
  Ticket,
} from "../types/ticket.types";


/**
 * Ticket query key.
 */
const TICKET_QUERY_KEY =
  "ticket";


/**
 * Use ticket hook.
 *
 * @param id Ticket identifier.
 * @returns Ticket query result.
 */
export function useTicket(
  id?: string,
) {
  return useQuery<Ticket>({
    queryKey: [
      TICKET_QUERY_KEY,
      id,
    ],

    queryFn: async () => {
      if (!id) {
        throw new Error(
          "Ticket id is required",
        );
      }

      return ticketService.getTicket(
        id,
      );
    },

    enabled: Boolean(id),
  });
}
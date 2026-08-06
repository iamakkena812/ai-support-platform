/**
 * React Query hook for retrieving a single ticket.
 *
 * Provides cached access to an individual ticket.
 */

import { useQuery } from "@tanstack/react-query";

import { ticketService } from "../services/ticket.service";
import type { Ticket } from "../types/ticket.types";

/**
 * Query key factory for ticket queries.
 */
export const ticketQueryKeys = {
  /**
   * Root query key.
   */
  all: ["tickets"] as const,

  /**
   * Detail query key.
   *
   * @param ticketId - Ticket identifier.
   * @returns Query key.
   */
  detail: (ticketId: string) =>
    [...ticketQueryKeys.all, "detail", ticketId] as const,
};

/**
 * Retrieves a single ticket.
 *
 * @param ticketId - Ticket identifier.
 * @returns React Query result.
 */
export const useTicket = (ticketId: string) =>
  useQuery<Ticket>({
    queryKey: ticketQueryKeys.detail(ticketId),
    queryFn: () => ticketService.getTicket(ticketId),
    enabled: ticketId.trim().length > 0,
  });
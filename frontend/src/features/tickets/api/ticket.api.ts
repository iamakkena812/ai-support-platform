/**
 * Ticket API client.
 *
 * Provides low-level HTTP operations for ticket resources.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateTicketRequest,
  Ticket,
  TicketListQuery,
  TicketListResponse,
  TicketStatistics,
  UpdateTicketRequest,
} from "../types/ticket.types";

/**
 * Tickets API endpoint.
 */
const BASE_PATH = "/tickets";

/**
 * Retrieves a paginated list of tickets.
 *
 * @param query - Ticket query parameters.
 * @returns Ticket list response.
 */
export const getTickets = async (
  query?: TicketListQuery,
): Promise<TicketListResponse> => {
  const { data } = await apiClient.get<TicketListResponse>(BASE_PATH, {
    params: query,
  });

  return data;
};

/**
 * Retrieves a ticket by identifier.
 *
 * @param ticketId - Ticket identifier.
 * @returns Ticket.
 */
export const getTicket = async (ticketId: string): Promise<Ticket> => {
  const { data } = await apiClient.get<Ticket>(
    `${BASE_PATH}/${ticketId}`,
  );

  return data;
};

/**
 * Creates a new ticket.
 *
 * @param payload - Ticket creation request.
 * @returns Created ticket.
 */
export const createTicket = async (
  payload: CreateTicketRequest,
): Promise<Ticket> => {
  const { data } = await apiClient.post<Ticket>(
    BASE_PATH,
    payload,
  );

  return data;
};

/**
 * Updates an existing ticket.
 *
 * @param ticketId - Ticket identifier.
 * @param payload - Ticket update request.
 * @returns Updated ticket.
 */
export const updateTicket = async (
  ticketId: string,
  payload: UpdateTicketRequest,
): Promise<Ticket> => {
  const { data } = await apiClient.put<Ticket>(
    `${BASE_PATH}/${ticketId}`,
    payload,
  );

  return data;
};

/**
 * Deletes a ticket.
 *
 * @param ticketId - Ticket identifier.
 */
export const deleteTicket = async (
  ticketId: string,
): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${ticketId}`);
};

/**
 * Retrieves ticket statistics.
 *
 * @returns Ticket statistics.
 */
export const getTicketStatistics =
  async (): Promise<TicketStatistics> => {
    const { data } = await apiClient.get<TicketStatistics>(
      `${BASE_PATH}/statistics`,
    );

    return data;
  };
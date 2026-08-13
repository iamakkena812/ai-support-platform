/**
 * Ticket API module.
 *
 * Handles ticket HTTP requests.
 */

import {
  apiClient,
} from "../../../api/axios/client";

import type {
  CreateTicketPayload,
  Ticket,
  TicketQueryFilters,
  TicketListResponse,
  UpdateTicketPayload,
} from "../types/ticket.types";


/**
 * Ticket API endpoint.
 */
const TICKET_ENDPOINT = "/tickets";


/**
 * Ticket API object.
 */
export const ticketApi = {

  /**
   * Get tickets.
   *
   * @param query Ticket query parameters.
   * @returns Ticket list response.
   */
  async getTickets(
    query?: TicketQueryFilters,
  ): Promise<TicketListResponse> {
    const response =
      await apiClient.get<TicketListResponse>(
        TICKET_ENDPOINT,
        {
          params: {
            page: query?.page,
            pageSize: query?.pageSize,
          },
        },
      );

    return response.data;
  },


  /**
   * Get ticket by identifier.
   *
   * @param id Ticket identifier.
   * @returns Ticket.
   */
  async getTicket(
    id: string,
  ): Promise<Ticket> {
    const response =
      await apiClient.get<Ticket>(
        `${TICKET_ENDPOINT}/${id}`,
      );

    return response.data;
  },


  /**
   * Create ticket.
   *
   * @param payload Ticket payload.
   * @returns Created ticket.
   */
  async createTicket(
    payload: CreateTicketPayload,
  ): Promise<Ticket> {
    const response =
      await apiClient.post<Ticket>(
        TICKET_ENDPOINT,
        payload,
      );

    return response.data;
  },


  /**
   * Update ticket.
   *
   * @param id Ticket identifier.
   * @param payload Update payload.
   * @returns Updated ticket.
   */
  async updateTicket(
    id: string,
    payload: UpdateTicketPayload,
  ): Promise<Ticket> {
    const response =
      await apiClient.patch<Ticket>(
        `${TICKET_ENDPOINT}/${id}`,
        payload,
      );

    return response.data;
  },


  /**
   * Delete ticket.
   *
   * @param id Ticket identifier.
   */
  async deleteTicket(
    id: string,
  ): Promise<void> {
    await apiClient.delete(
      `${TICKET_ENDPOINT}/${id}`,
    );
  },

};

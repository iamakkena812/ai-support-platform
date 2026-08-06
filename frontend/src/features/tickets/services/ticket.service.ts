/**
 * Ticket service.
 *
 * Provides the service layer between the UI and the
 * ticket API client.
 */

import {
  createTicket,
  deleteTicket,
  getTicket,
  getTickets,
  getTicketStatistics,
  updateTicket,
} from "../api/ticket.api";

import type {
  CreateTicketRequest,
  Ticket,
  TicketListQuery,
  TicketListResponse,
  TicketStatistics,
  UpdateTicketRequest,
} from "../types/ticket.types";

/**
 * Ticket service.
 */
export const ticketService = {
  /**
   * Retrieves all tickets.
   *
   * @param query - Ticket query parameters.
   * @returns Paginated ticket response.
   */
  async getTickets(
    query?: TicketListQuery,
  ): Promise<TicketListResponse> {
    return getTickets(query);
  },

  /**
   * Retrieves a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @returns Ticket.
   */
  async getTicket(ticketId: string): Promise<Ticket> {
    return getTicket(ticketId);
  },

  /**
   * Creates a ticket.
   *
   * @param payload - Ticket creation payload.
   * @returns Created ticket.
   */
  async createTicket(
    payload: CreateTicketRequest,
  ): Promise<Ticket> {
    return createTicket(payload);
  },

  /**
   * Updates a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @param payload - Ticket update payload.
   * @returns Updated ticket.
   */
  async updateTicket(
    ticketId: string,
    payload: UpdateTicketRequest,
  ): Promise<Ticket> {
    return updateTicket(ticketId, payload);
  },

  /**
   * Deletes a ticket.
   *
   * @param ticketId - Ticket identifier.
   */
  async deleteTicket(ticketId: string): Promise<void> {
    return deleteTicket(ticketId);
  },

  /**
   * Retrieves ticket statistics.
   *
   * @returns Ticket statistics.
   */
  async getTicketStatistics(): Promise<TicketStatistics> {
    return getTicketStatistics();
  },
};
/**
 * Ticket service module.
 *
 * Provides business operations
 * for ticket management.
 */

import {
  ticketApi,
} from "../api/ticket.api";

import {
  ticketListResponseSchema,
  ticketSchema,
} from "../schemas/ticket.schema";

import type {
  CreateTicketPayload,
  Ticket,
  TicketQueryFilters,
  TicketListResponse,
  UpdateTicketPayload,
} from "../types/ticket.types";


/**
 * Ticket service.
 */
export const ticketService = {

  /**
   * Get tickets.
   *
   * @param query Ticket query.
   * @returns Ticket list.
   */
  async getTickets(
    query?: TicketQueryFilters,
  ): Promise<TicketListResponse> {
    const response =
      await ticketApi.getTickets(
        query,
      );

    return ticketListResponseSchema.parse(
      response,
    );
  },


  /**
   * Get ticket by id.
   *
   * @param id Ticket identifier.
   * @returns Ticket.
   */
  async getTicket(
    id: string,
  ): Promise<Ticket> {
    const response =
      await ticketApi.getTicket(
        id,
      );

    return ticketSchema.parse(
      response,
    );
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
      await ticketApi.createTicket(
        payload,
      );

    return ticketSchema.parse(
      response,
    );
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
      await ticketApi.updateTicket(
        id,
        payload,
      );

    return ticketSchema.parse(
      response,
    );
  },


  /**
   * Delete ticket.
   *
   * @param id Ticket identifier.
   */
  async deleteTicket(
    id: string,
  ): Promise<void> {
    await ticketApi.deleteTicket(
      id,
    );
  },

};

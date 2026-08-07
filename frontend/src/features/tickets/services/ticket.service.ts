/**
 * Ticket service module.
 *
 * Provides business operations
 * for ticket management.
 */

import {
  ticketApi,
} from "../api/ticket.api";

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
    return ticketApi.getTickets(
      query,
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
    return ticketApi.getTicket(
      id,
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
    return ticketApi.createTicket(
      payload,
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
    return ticketApi.updateTicket(
      id,
      payload,
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
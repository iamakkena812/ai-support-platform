/**
 * SLA service.
 *
 * Provides the service layer between the UI and the SLA API client.
 */

import { slaApi } from "../api/sla.api";

import type {
  BreachedTicket,
  CreateSLAPolicyRequest,
  SLAEvent,
  SLAPolicy,
  UpdateSLAPolicyRequest,
} from "../types/sla.types";

/**
 * SLA service.
 */
export const slaService = {
  /**
   * Returns the SLA policies belonging to the caller's organization.
   *
   * @param activeOnly - Whether to return only active policies.
   * @returns SLA policies.
   */
  async listPolicies(activeOnly = false): Promise<readonly SLAPolicy[]> {
    return slaApi.listPolicies(activeOnly);
  },

  /**
   * Returns a single SLA policy.
   *
   * @param policyId - Policy identifier.
   * @returns SLA policy.
   */
  async getPolicy(policyId: string): Promise<SLAPolicy> {
    return slaApi.getPolicy(policyId);
  },

  /**
   * Creates a new SLA policy.
   *
   * @param request - Policy creation request.
   * @returns Created policy.
   */
  async createPolicy(request: CreateSLAPolicyRequest): Promise<SLAPolicy> {
    return slaApi.createPolicy(request);
  },

  /**
   * Updates an SLA policy.
   *
   * @param policyId - Policy identifier.
   * @param request - Update request.
   * @returns Updated policy.
   */
  async updatePolicy(
    policyId: string,
    request: UpdateSLAPolicyRequest,
  ): Promise<SLAPolicy> {
    return slaApi.updatePolicy(policyId, request);
  },

  /**
   * Deletes an SLA policy.
   *
   * @param policyId - Policy identifier.
   */
  async deletePolicy(policyId: string): Promise<void> {
    return slaApi.deletePolicy(policyId);
  },

  /**
   * Returns breached SLA tickets for the caller's organization.
   *
   * @returns Breached tickets.
   */
  async listBreached(): Promise<readonly BreachedTicket[]> {
    return slaApi.listBreached();
  },

  /**
   * Returns the SLA event for a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @returns SLA event.
   */
  async getTicketSLA(ticketId: string): Promise<SLAEvent> {
    return slaApi.getTicketSLA(ticketId);
  },

  /**
   * Assigns an SLA policy to a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @param policyId - Policy identifier.
   * @returns Created SLA event.
   */
  async assignPolicy(ticketId: string, policyId: string): Promise<SLAEvent> {
    return slaApi.assignPolicy(ticketId, policyId);
  },

  /**
   * Records the first response for a ticket's SLA event.
   *
   * @param ticketId - Ticket identifier.
   * @returns Updated SLA event.
   */
  async recordFirstResponse(ticketId: string): Promise<SLAEvent> {
    return slaApi.recordFirstResponse(ticketId);
  },

  /**
   * Records resolution for a ticket's SLA event.
   *
   * @param ticketId - Ticket identifier.
   * @returns Updated SLA event.
   */
  async resolveTicket(ticketId: string): Promise<SLAEvent> {
    return slaApi.resolveTicket(ticketId);
  },
};

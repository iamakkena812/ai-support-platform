/**
 * SLA API.
 *
 * Talks to the real backend SLA endpoints (`/api/v1/sla/*`, see
 * `app/sla/router.py`), which use a plain snake_case JSON contract (no
 * camelCase alias generator).
 */

import { apiClient } from "../../../api/axios/client";

import type {
  BreachedTicket,
  CreateSLAPolicyRequest,
  SLAEvent,
  SLAPolicy,
  UpdateSLAPolicyRequest,
} from "../types/sla.types";

interface BackendSLAPolicy {
  readonly id: string;
  readonly organization_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly priority: string;
  readonly first_response_minutes: number;
  readonly resolution_minutes: number;
  readonly business_hours_only: boolean;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

interface BackendSLAEvent {
  readonly id: string;
  readonly ticket_id: string;
  readonly policy_id: string;
  readonly started_at: string;
  readonly first_response_due: string;
  readonly resolution_due: string;
  readonly first_response_at: string | null;
  readonly resolved_at: string | null;
  readonly first_response_breached: boolean;
  readonly resolution_breached: boolean;
}

interface BackendBreachedTicket {
  readonly ticket_id: string;
  readonly policy_id: string;
  readonly first_response_breached: boolean;
  readonly resolution_breached: boolean;
}

const BASE_PATH = "/sla";

/**
 * Maps a backend SLA policy into the frontend model.
 *
 * @param policy - Backend SLA policy.
 * @returns Frontend SLA policy.
 */
function mapPolicy(policy: BackendSLAPolicy): SLAPolicy {
  return {
    id: policy.id,
    organizationId: policy.organization_id,
    name: policy.name,
    description: policy.description,
    priority: policy.priority as SLAPolicy["priority"],
    firstResponseMinutes: policy.first_response_minutes,
    resolutionMinutes: policy.resolution_minutes,
    businessHoursOnly: policy.business_hours_only,
    isActive: policy.is_active,
    createdAt: policy.created_at,
    updatedAt: policy.updated_at,
  };
}

/**
 * Maps a backend SLA event into the frontend model.
 *
 * @param event - Backend SLA event.
 * @returns Frontend SLA event.
 */
function mapEvent(event: BackendSLAEvent): SLAEvent {
  return {
    id: event.id,
    ticketId: event.ticket_id,
    policyId: event.policy_id,
    startedAt: event.started_at,
    firstResponseDue: event.first_response_due,
    resolutionDue: event.resolution_due,
    firstResponseAt: event.first_response_at,
    resolvedAt: event.resolved_at,
    firstResponseBreached: event.first_response_breached,
    resolutionBreached: event.resolution_breached,
  };
}

/**
 * SLA API client.
 */
export const slaApi = {
  /**
   * Returns the SLA policies belonging to the caller's organization.
   *
   * @param activeOnly - Whether to return only active policies.
   * @returns SLA policies.
   */
  async listPolicies(activeOnly = false): Promise<readonly SLAPolicy[]> {
    const { data } = await apiClient.get<readonly BackendSLAPolicy[]>(
      `${BASE_PATH}/policies`,
      { params: { active_only: activeOnly } },
    );

    return data.map(mapPolicy);
  },

  /**
   * Returns a single SLA policy.
   *
   * @param policyId - Policy identifier.
   * @returns SLA policy.
   */
  async getPolicy(policyId: string): Promise<SLAPolicy> {
    const { data } = await apiClient.get<BackendSLAPolicy>(
      `${BASE_PATH}/policies/${policyId}`,
    );

    return mapPolicy(data);
  },

  /**
   * Creates a new SLA policy.
   *
   * @param request - Policy creation request.
   * @returns Created policy.
   */
  async createPolicy(request: CreateSLAPolicyRequest): Promise<SLAPolicy> {
    const { data } = await apiClient.post<BackendSLAPolicy>(
      `${BASE_PATH}/policies`,
      {
        name: request.name,
        description: request.description,
        priority: request.priority,
        first_response_minutes: request.firstResponseMinutes,
        resolution_minutes: request.resolutionMinutes,
        business_hours_only: request.businessHoursOnly ?? false,
        is_active: request.isActive ?? true,
      },
    );

    return mapPolicy(data);
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
    const { data } = await apiClient.patch<BackendSLAPolicy>(
      `${BASE_PATH}/policies/${policyId}`,
      {
        name: request.name,
        description: request.description,
        priority: request.priority,
        first_response_minutes: request.firstResponseMinutes,
        resolution_minutes: request.resolutionMinutes,
        business_hours_only: request.businessHoursOnly,
        is_active: request.isActive,
      },
    );

    return mapPolicy(data);
  },

  /**
   * Deletes an SLA policy.
   *
   * @param policyId - Policy identifier.
   */
  async deletePolicy(policyId: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/policies/${policyId}`);
  },

  /**
   * Returns breached SLA tickets for the caller's organization.
   *
   * @returns Breached tickets.
   */
  async listBreached(): Promise<readonly BreachedTicket[]> {
    const { data } = await apiClient.get<readonly BackendBreachedTicket[]>(
      `${BASE_PATH}/breached`,
    );

    return data.map((item) => ({
      ticketId: item.ticket_id,
      policyId: item.policy_id,
      firstResponseBreached: item.first_response_breached,
      resolutionBreached: item.resolution_breached,
    }));
  },

  /**
   * Returns the SLA event for a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @returns SLA event.
   */
  async getTicketSLA(ticketId: string): Promise<SLAEvent> {
    const { data } = await apiClient.get<BackendSLAEvent>(
      `${BASE_PATH}/tickets/${ticketId}`,
    );

    return mapEvent(data);
  },

  /**
   * Assigns an SLA policy to a ticket.
   *
   * @param ticketId - Ticket identifier.
   * @param policyId - Policy identifier.
   * @returns Created SLA event.
   */
  async assignPolicy(ticketId: string, policyId: string): Promise<SLAEvent> {
    const { data } = await apiClient.post<BackendSLAEvent>(
      `${BASE_PATH}/tickets/${ticketId}/assign`,
      { policy_id: policyId },
    );

    return mapEvent(data);
  },

  /**
   * Records the first response for a ticket's SLA event.
   *
   * @param ticketId - Ticket identifier.
   * @returns Updated SLA event.
   */
  async recordFirstResponse(ticketId: string): Promise<SLAEvent> {
    const { data } = await apiClient.post<BackendSLAEvent>(
      `${BASE_PATH}/tickets/${ticketId}/first-response`,
    );

    return mapEvent(data);
  },

  /**
   * Records resolution for a ticket's SLA event.
   *
   * @param ticketId - Ticket identifier.
   * @returns Updated SLA event.
   */
  async resolveTicket(ticketId: string): Promise<SLAEvent> {
    const { data } = await apiClient.post<BackendSLAEvent>(
      `${BASE_PATH}/tickets/${ticketId}/resolve`,
    );

    return mapEvent(data);
  },
};

/**
 * SLA domain types.
 *
 * Mirrors the real backend contract in `app/sla/schemas.py`.
 */

/**
 * SLA policy priority.
 *
 * Matches `SLAPriority` in `app/sla/constants.py`.
 */
export type SLAPriority = "low" | "medium" | "high" | "critical";

/**
 * An SLA policy.
 */
export interface SLAPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string | null;
  readonly priority: SLAPriority;
  readonly firstResponseMinutes: number;
  readonly resolutionMinutes: number;
  readonly businessHoursOnly: boolean;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Request to create an SLA policy.
 *
 * `organizationId` is deliberately absent -- the backend derives it from
 * the authenticated caller, never trusting client-supplied values.
 */
export interface CreateSLAPolicyRequest {
  readonly name: string;
  readonly description?: string;
  readonly priority: SLAPriority;
  readonly firstResponseMinutes: number;
  readonly resolutionMinutes: number;
  readonly businessHoursOnly?: boolean;
  readonly isActive?: boolean;
}

/**
 * Request to update an SLA policy.
 */
export interface UpdateSLAPolicyRequest {
  readonly name?: string;
  readonly description?: string;
  readonly priority?: SLAPriority;
  readonly firstResponseMinutes?: number;
  readonly resolutionMinutes?: number;
  readonly businessHoursOnly?: boolean;
  readonly isActive?: boolean;
}

/**
 * The SLA tracking event for a single ticket.
 */
export interface SLAEvent {
  readonly id: string;
  readonly ticketId: string;
  readonly policyId: string;
  readonly startedAt: string;
  readonly firstResponseDue: string;
  readonly resolutionDue: string;
  readonly firstResponseAt: string | null;
  readonly resolvedAt: string | null;
  readonly firstResponseBreached: boolean;
  readonly resolutionBreached: boolean;
}

/**
 * A breached SLA ticket summary.
 */
export interface BreachedTicket {
  readonly ticketId: string;
  readonly policyId: string;
  readonly firstResponseBreached: boolean;
  readonly resolutionBreached: boolean;
}

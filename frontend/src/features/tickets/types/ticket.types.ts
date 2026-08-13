/**
 * Ticket domain types.
 *
 * Defines ticket entities,
 * filters, and payload contracts.
 */


/**
 * Ticket status.
 */
export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed";


/**
 * Ticket priority.
 */
export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";


/**
 * Ticket entity.
 */
export interface Ticket {

  /**
   * Ticket identifier.
   */
  readonly id: string;


  /**
   * Organization identifier.
   */
  readonly organizationId: string;


  /**
   * Identifier of the user who created the ticket.
   */
  readonly createdBy: string;


  /**
   * Ticket title.
   */
  readonly title: string;


  /**
   * Ticket description.
   */
  readonly description: string;


  /**
   * Ticket status.
   */
  readonly status: TicketStatus;


  /**
   * Ticket priority.
   */
  readonly priority: TicketPriority;


  /**
   * Assigned user identifier.
   */
  readonly assignedTo?: string | null;


  /**
   * Whether the ticket is active.
   */
  readonly isActive: boolean;


  /**
   * Created date.
   */
  readonly createdAt: string;


  /**
   * Updated date.
   */
  readonly updatedAt: string;
}


/**
 * Ticket filters.
 */
export interface TicketFilterValues {

  /**
   * Search text.
   */
  readonly search?: string;


  /**
   * Status.
   */
  readonly status?: TicketStatus;


  /**
   * Priority.
   */
  readonly priority?: TicketPriority;


  /**
   * Page.
   */
  readonly page?: number;


  /**
   * Page size.
   */
  readonly pageSize?: number;
}


/**
 * Alias for query filters.
 */
export type TicketQueryFilters =
  TicketFilterValues;


/**
 * Ticket list response.
 */
export interface TicketListResponse {

  /**
   * Tickets.
   */
  readonly items: readonly Ticket[];


  /**
   * Total records.
   */
  readonly total: number;


  /**
   * Current page.
   */
  readonly page: number;


  /**
   * Page size.
   */
  readonly pageSize: number;


  /**
   * Total pages.
   */
  readonly totalPages: number;
}


/**
 * Create ticket payload.
 */
export interface CreateTicketPayload {

  /**
   * Ticket title.
   */
  readonly title: string;


  /**
   * Description.
   */
  readonly description: string;


  /**
   * Priority.
   */
  readonly priority: TicketPriority;


  /**
   * Status.
   */
  readonly status?: TicketStatus;


  /**
   * Assigned user.
   */
  readonly assignedTo?: string | null;
}


/**
 * Update ticket payload.
 */
export interface UpdateTicketPayload {

  /**
   * Ticket title.
   */
  readonly title?: string;


  /**
   * Description.
   */
  readonly description?: string;


  /**
   * Status.
   */
  readonly status?: TicketStatus;


  /**
   * Priority.
   */
  readonly priority?: TicketPriority;


  /**
   * Assigned user.
   */
  readonly assignedTo?: string | null;


  /**
   * Whether the ticket is active.
   */
  readonly isActive?: boolean;
}

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
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING"
  | "RESOLVED"
  | "CLOSED";


/**
 * Ticket priority.
 */
export type TicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";


/**
 * Ticket type.
 */
export type TicketType =
  | "incident"
  | "service_request"
  | "bug"
  | "task"
  | "question"
  | "feature_request";


/**
 * User reference.
 */
export interface UserReference {

  /**
   * User identifier.
   */
  readonly id: string;


  /**
   * User name.
   */
  readonly name: string;


  /**
   * User email.
   */
  readonly email?: string;
}


/**
 * Customer reference.
 */
export interface CustomerReference {

  /**
   * Customer identifier.
   */
  readonly id: string;


  /**
   * Customer name.
   */
  readonly name: string;
}


/**
 * Organization reference.
 */
export interface OrganizationReference {

  /**
   * Organization identifier.
   */
  readonly id: string;


  /**
   * Organization name.
   */
  readonly name: string;
}


/**
 * Project reference.
 */
export interface ProjectReference {

  /**
   * Project identifier.
   */
  readonly id: string;


  /**
   * Project name.
   */
  readonly name: string;
}


/**
 * Ticket entity.
 */
export interface Ticket {

  /**
   * Ticket identifier.
   */
  readonly id: string;


  /**
   * Ticket number.
   */
  readonly ticketNumber: string;


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
   * Ticket type.
   */
  readonly type: TicketType;


  /**
   * Customer.
   */
  readonly customer?: CustomerReference | null;


  /**
   * Customer identifier.
   */
  readonly customerId: string;


  /**
   * Organization.
   */
  readonly organization?: OrganizationReference | null;


  /**
   * Organization identifier.
   */
  readonly organizationId?: string | null;


  /**
   * Project.
   */
  readonly project?: ProjectReference | null;


  /**
   * Project identifier.
   */
  readonly projectId?: string | null;


  /**
   * Assigned user.
   */
  readonly assignee?: UserReference | null;


  /**
   * Assigned user identifier.
   */
  readonly assignedTo?: string | null;


  /**
   * Assigned user name.
   */
  readonly assignedUserName?: string;


  /**
   * Created user.
   */
  readonly createdBy?: UserReference | null;


  /**
   * Created date.
   */
  readonly createdAt: string | Date;


  /**
   * Updated date.
   */
  readonly updatedAt: string | Date;


  /**
   * Resolved date.
   */
  readonly resolvedAt?: string | Date | null;


  /**
   * Closed date.
   */
  readonly closedAt?: string | Date | null;
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
   * Type.
   */
  readonly type?: TicketType;


  /**
   * Customer identifier.
   */
  readonly customerId?: string;


  /**
   * Project identifier.
   */
  readonly projectId?: string;


  /**
   * Assigned user.
   */
  readonly assignedTo?: string;


  /**
   * Page.
   */
  readonly page?: number;


  /**
   * Limit.
   */
  readonly limit?: number;
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
  readonly limit: number;
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
   * Ticket type.
   */
  readonly type: TicketType;


  /**
   * Customer identifier.
   */
  readonly customerId: string;


  /**
   * Priority.
   */
  readonly priority: TicketPriority;


  /**
   * Project identifier.
   */
  readonly projectId?: string | null;


  /**
   * Organization identifier.
   */
  readonly organizationId?: string | null;


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
   * Ticket type.
   */
  readonly type?: TicketType;


  /**
   * Project identifier.
   */
  readonly projectId?: string | null;


  /**
   * Assigned user.
   */
  readonly assignedTo?: string | null;
}
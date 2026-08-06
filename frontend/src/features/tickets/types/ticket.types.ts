/**
 * Ticket domain types.
 *
 * Defines the TypeScript models used throughout the Tickets feature.
 * These types represent the frontend domain model and API contracts.
 */

/**
 * Ticket status values.
 */
export type TicketStatus =
  | "new"
  | "open"
  | "in_progress"
  | "pending"
  | "resolved"
  | "closed";

/**
 * Ticket priority values.
 */
export type TicketPriority = "low" | "medium" | "high" | "urgent";

/**
 * Ticket type values.
 */
export type TicketType =
  | "incident"
  | "service_request"
  | "bug"
  | "task"
  | "question"
  | "feature_request";

/**
 * Sort direction.
 */
export type SortDirection = "asc" | "desc";

/**
 * Lightweight user reference.
 */
export interface UserReference {
  /** User identifier. */
  id: string;

  /** Full name. */
  name: string;

  /** Email address. */
  email?: string | null;
}

/**
 * Lightweight customer reference.
 */
export interface CustomerReference {
  /** Customer identifier. */
  id: string;

  /** Customer name. */
  name: string;
}

/**
 * Lightweight organization reference.
 */
export interface OrganizationReference {
  /** Organization identifier. */
  id: string;

  /** Organization name. */
  name: string;
}

/**
 * Lightweight project reference.
 */
export interface ProjectReference {
  /** Project identifier. */
  id: string;

  /** Project name. */
  name: string;
}

/**
 * Ticket entity.
 */
export interface Ticket {
  /** Ticket identifier. */
  id: string;

  /** Human-readable ticket number. */
  ticketNumber: string;

  /** Ticket title. */
  title: string;

  /** Ticket description. */
  description: string;

  /** Ticket status. */
  status: TicketStatus;

  /** Ticket priority. */
  priority: TicketPriority;

  /** Ticket classification. */
  type: TicketType;

  /** Organization. */
  organization?: OrganizationReference | null;

  /** Customer. */
  customer?: CustomerReference | null;

  /** Related project. */
  project?: ProjectReference | null;

  /** Assigned user. */
  assignee?: UserReference | null;

  /** User who created the ticket. */
  createdBy?: UserReference | null;

  /** Creation timestamp. */
  createdAt: string;

  /** Last update timestamp. */
  updatedAt: string;

  /** Resolution timestamp. */
  resolvedAt?: string | null;

  /** Close timestamp. */
  closedAt?: string | null;
}

/**
 * Payload for creating a ticket.
 */
export interface CreateTicketRequest {
  /** Ticket title. */
  title: string;

  /** Ticket description. */
  description: string;

  /** Ticket type. */
  type: TicketType;

  /** Ticket priority. */
  priority: TicketPriority;

  /** Customer identifier. */
  customerId: string;

  /** Project identifier. */
  projectId?: string | null;

  /** Organization identifier. */
  organizationId?: string | null;

  /** Assignee identifier. */
  assigneeId?: string | null;
}

/**
 * Payload for updating a ticket.
 */
export interface UpdateTicketRequest {
  /** Ticket title. */
  title?: string;

  /** Ticket description. */
  description?: string;

  /** Ticket status. */
  status?: TicketStatus;

  /** Ticket priority. */
  priority?: TicketPriority;

  /** Ticket type. */
  type?: TicketType;

  /** Project identifier. */
  projectId?: string | null;

  /** Assignee identifier. */
  assigneeId?: string | null;
}

/**
 * Ticket filter parameters.
 */
export interface TicketFilterValues {
  /** Search term. */
  search?: string;

  /** Status filter. */
  status?: TicketStatus;

  /** Priority filter. */
  priority?: TicketPriority;

  /** Type filter. */
  type?: TicketType;

  /** Customer identifier. */
  customerId?: string;

  /** Project identifier. */
  projectId?: string;

  /** Assignee identifier. */
  assigneeId?: string;
}

/**
 * Ticket sorting options.
 */
export interface TicketSort {
  /** Field name. */
  field: keyof Ticket;

  /** Sort direction. */
  direction: SortDirection;
}

/**
 * Ticket list query parameters.
 */
export interface TicketListQuery {
  /** Page number. */
  page?: number;

  /** Page size. */
  pageSize?: number;

  /** Filters. */
  filters?: TicketFilterValues;

  /** Sorting. */
  sort?: TicketSort;
}

/**
 * Paginated ticket response.
 */
export interface TicketListResponse {
  /** Returned tickets. */
  items: Ticket[];

  /** Total records. */
  total: number;

  /** Current page. */
  page: number;

  /** Page size. */
  pageSize: number;

  /** Total pages. */
  totalPages: number;
}

/**
 * Ticket statistics.
 */
export interface TicketStatistics {
  /** Total tickets. */
  total: number;

  /** Open tickets. */
  open: number;

  /** In-progress tickets. */
  inProgress: number;

  /** Pending tickets. */
  pending: number;

  /** Resolved tickets. */
  resolved: number;

  /** Closed tickets. */
  closed: number;
}
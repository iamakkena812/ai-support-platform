/**
 * Customer domain types.
 *
 * Contains customer-related
 * TypeScript definitions.
 */

/**
 * Customer status.
 */
export type CustomerStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PROSPECT"
  | "PENDING"
  | "SUSPENDED"
  | "BLOCKED";

/**
 * Customer entity.
 */
export interface Customer {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly company?: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Phone number.
   */
  readonly phone?: string;

  /**
   * Contact person.
   */
  readonly contactPerson?: string;

  /**
   * Industry.
   */
  readonly industry?: string;

  /**
   * Address.
   */
  readonly address?: string;

  /**
   * Customer status.
   */
  readonly status: CustomerStatus;

  /**
   * Organization count.
   */
  readonly organizationCount: number;

  /**
   * Project count.
   */
  readonly projectCount: number;

  /**
   * Ticket count.
   */
  readonly ticketCount: number;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;

  /**
   * Updated timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Customer create payload.
 */
export interface CreateCustomerPayload {
  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company.
   */
  readonly company?: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Contact person.
   */
  readonly contactPerson?: string;

  /**
   * Industry.
   */
  readonly industry?: string;

  /**
   * Address.
   */
  readonly address?: string;

  /**
   * Status.
   */
  readonly status?: CustomerStatus;
}

/**
 * Customer update payload.
 */
export interface UpdateCustomerPayload {
  /**
   * Customer name.
   */
  readonly name?: string;

  /**
   * Company.
   */
  readonly company?: string;

  /**
   * Email.
   */
  readonly email?: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Contact person.
   */
  readonly contactPerson?: string;

  /**
   * Industry.
   */
  readonly industry?: string;

  /**
   * Address.
   */
  readonly address?: string;

  /**
   * Status.
   */
  readonly status?: CustomerStatus;
}

/**
 * Customer list query parameters.
 */
export interface CustomerQueryFilters {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Status filter.
   */
  readonly status?: CustomerStatus;

  /**
   * Industry filter.
   */
  readonly industry?: string;

  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly limit?: number;
}

/**
 * Customer paginated response.
 */
export interface CustomerListResponse {
  /**
   * Customer items.
   */
  readonly items: readonly Customer[];

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

  /**
   * Total pages.
   */
  readonly pages: number;
}
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
  | "active"
  | "inactive"
  | "suspended";

/**
 * Customer type.
 */
export type CustomerType =
  | "individual"
  | "business";

/**
 * Customer entity.
 */
export interface Customer {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly companyName?: string | null;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Phone number.
   */
  readonly phone?: string | null;

  /**
   * Website.
   */
  readonly website?: string | null;

  /**
   * Address.
   */
  readonly address?: string | null;

  /**
   * City.
   */
  readonly city?: string | null;

  /**
   * State.
   */
  readonly state?: string | null;

  /**
   * Country.
   */
  readonly country?: string | null;

  /**
   * Postal code.
   */
  readonly postalCode?: string | null;

  /**
   * Customer type.
   */
  readonly customerType: CustomerType;

  /**
   * Customer status.
   */
  readonly status: CustomerStatus;

  /**
   * Whether the customer is active.
   */
  readonly isActive: boolean;

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
   * Company name.
   */
  readonly companyName?: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Website.
   */
  readonly website?: string;

  /**
   * Address.
   */
  readonly address?: string;

  /**
   * City.
   */
  readonly city?: string;

  /**
   * State.
   */
  readonly state?: string;

  /**
   * Country.
   */
  readonly country?: string;

  /**
   * Postal code.
   */
  readonly postalCode?: string;

  /**
   * Customer type.
   */
  readonly customerType?: CustomerType;

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
   * Company name.
   */
  readonly companyName?: string;

  /**
   * Email.
   */
  readonly email?: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Website.
   */
  readonly website?: string;

  /**
   * Address.
   */
  readonly address?: string;

  /**
   * City.
   */
  readonly city?: string;

  /**
   * State.
   */
  readonly state?: string;

  /**
   * Country.
   */
  readonly country?: string;

  /**
   * Postal code.
   */
  readonly postalCode?: string;

  /**
   * Customer type.
   */
  readonly customerType?: CustomerType;

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
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;
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
  readonly pageSize: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;
}

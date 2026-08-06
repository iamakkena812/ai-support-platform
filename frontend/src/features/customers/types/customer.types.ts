/**
 * Customer domain types.
 */

/**
 * Customer.
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
   * Customer first name.
   */
  readonly firstName: string;

  /**
   * Customer last name.
   */
  readonly lastName: string;

  /**
   * Customer email address.
   */
  readonly email: string;

  /**
   * Customer phone number.
   */
  readonly phone: string | null;

  /**
   * Company name.
   */
  readonly company: string | null;

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
 * Create customer request.
 */
export interface CreateCustomerRequest {
  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Customer first name.
   */
  readonly firstName: string;

  /**
   * Customer last name.
   */
  readonly lastName: string;

  /**
   * Customer email address.
   */
  readonly email: string;

  /**
   * Customer phone number.
   */
  readonly phone?: string | null;

  /**
   * Company name.
   */
  readonly company?: string | null;
}

/**
 * Update customer request.
 */
export interface UpdateCustomerRequest {
  /**
   * Customer first name.
   */
  readonly firstName?: string;

  /**
   * Customer last name.
   */
  readonly lastName?: string;

  /**
   * Customer email address.
   */
  readonly email?: string;

  /**
   * Customer phone number.
   */
  readonly phone?: string | null;

  /**
   * Company name.
   */
  readonly company?: string | null;

  /**
   * Whether the customer is active.
   */
  readonly isActive?: boolean;
}

/**
 * Customer list response.
 */
export interface CustomerListResponse {
  /**
   * Customers.
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
  readonly size: number;
}

/**
 * Customer response.
 */
export interface CustomerResponse {
  /**
   * Customer.
   */
  readonly customer: Customer;
}
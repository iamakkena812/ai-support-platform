/**
 * User domain types.
 */

/**
 * User.
 */
export interface User {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * First name.
   */
  readonly firstName: string;

  /**
   * Last name.
   */
  readonly lastName: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Team identifier.
   */
  readonly teamId?: string | null;

  /**
   * User role.
   */
  readonly role: string;

  /**
   * Whether the user is active.
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
 * Create user request.
 */
export interface CreateUserRequest {
  /**
   * First name.
   */
  readonly firstName: string;

  /**
   * Last name.
   */
  readonly lastName: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Team identifier.
   */
  readonly teamId?: string | null;

  /**
   * User role.
   */
  readonly role: string;
}

/**
 * Update user request.
 */
export interface UpdateUserRequest {
  /**
   * First name.
   */
  readonly firstName?: string;

  /**
   * Last name.
   */
  readonly lastName?: string;

  /**
   * Email address.
   */
  readonly email?: string;

  /**
   * Team identifier.
   */
  readonly teamId?: string | null;

  /**
   * User role.
   */
  readonly role?: string;

  /**
   * Whether the user is active.
   */
  readonly isActive?: boolean;
}

/**
 * User list response.
 */
export interface UserListResponse {
  /**
   * Users.
   */
  readonly items: readonly User[];

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
 * User response.
 */
export interface UserResponse {
  /**
   * User.
   */
  readonly user: User;
}
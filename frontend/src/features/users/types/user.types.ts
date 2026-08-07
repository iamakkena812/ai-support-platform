/**
 * User domain types.
 *
 * Defines the TypeScript models used throughout the
 * Users feature.
 */


/**
 * User status.
 */
export type UserStatus =
  | "active"
  | "inactive"
  | "suspended";


/**
 * User role.
 */
export type UserRole =
  | "admin"
  | "manager"
  | "agent"
  | "customer";


/**
 * Organization reference.
 */
export interface UserOrganization {

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
 * User role reference.
 */
export interface UserRoleInfo {

  /**
   * Role identifier.
   */
  readonly id: string;


  /**
   * Role name.
   */
  readonly name: string;


  /**
   * Role description.
   */
  readonly description?: string | null;
}


/**
 * User entity.
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
   * Full name.
   */
  readonly fullName: string;


  /**
   * Email address.
   */
  readonly email: string;


  /**
   * Phone number.
   */
  readonly phone?: string | null;


  /**
   * Avatar URL.
   */
  readonly avatarUrl?: string | null;


  /**
   * User status.
   */
  readonly status: UserStatus;


  /**
   * User organization.
   */
  readonly organization?: UserOrganization | null;


  /**
   * Assigned roles.
   */
  readonly roles: UserRoleInfo[];


  /**
   * Last login timestamp.
   */
  readonly lastLoginAt?: string | null;


  /**
   * Creation timestamp.
   */
  readonly createdAt: string;


  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}


/**
 * Create user request.
 */
export interface CreateUserRequest {

  /**
   * Organization identifier.
   */
  readonly organizationId: string;


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
   * Password.
   */
  readonly password: string;


  /**
   * Role identifiers.
   *
   * Mutable array required for React Hook Form compatibility.
   */
  readonly roleIds?: string[];
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
   * Phone number.
   */
  readonly phone?: string | null;


  /**
   * Avatar URL.
   */
  readonly avatarUrl?: string | null;


  /**
   * User status.
   */
  readonly status?: UserStatus;


  /**
   * Role identifiers.
   */
  readonly roleIds?: string[];
}


/**
 * User filter values.
 */
export interface UserFilterValues {

  /**
   * Search text.
   */
  readonly search?: string;


  /**
   * Organization identifier.
   */
  readonly organizationId?: string;


  /**
   * User status.
   */
  readonly status?: UserStatus;


  /**
   * User role.
   */
  readonly role?: UserRole;
}


/**
 * Sort direction.
 */
export type SortDirection =
  | "asc"
  | "desc";


/**
 * User sorting.
 */
export interface UserSort {

  /**
   * Sort field.
   */
  readonly field: keyof User;


  /**
   * Sort direction.
   */
  readonly direction: SortDirection;
}


/**
 * User list query.
 */
export interface UserListQuery {

  /**
   * Page number.
   */
  readonly page?: number;


  /**
   * Page size.
   */
  readonly pageSize?: number;


  /**
   * Filters.
   */
  readonly filters?: UserFilterValues;


  /**
   * Sorting.
   */
  readonly sort?: UserSort;
}


/**
 * Paginated user response.
 */
export interface UserListResponse {

  /**
   * Returned users.
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
  readonly pageSize: number;


  /**
   * Total pages.
   */
  readonly totalPages: number;
}


/**
 * Single user response.
 */
export interface UserResponse {

  /**
   * User entity.
   */
  readonly user: User;
}


/**
 * User statistics.
 */
export interface UserStatistics {

  /**
   * Total users.
   */
  readonly total: number;


  /**
   * Active users.
   */
  readonly active: number;


  /**
   * Inactive users.
   */
  readonly inactive: number;


  /**
   * Suspended users.
   */
  readonly suspended: number;
}
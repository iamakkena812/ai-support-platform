/**
 * User domain types.
 *
 * Defines the TypeScript models used throughout the
 * Users feature. Mirrors backend/app/users/schemas.py exactly.
 */


/**
 * User entity.
 */
export interface User {
  readonly id: string;
  readonly organizationId: string;
  readonly email: string;
  readonly username: string;
  readonly fullName: string;
  readonly isActive: boolean;
  readonly isSuperuser: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}


/**
 * Create user request.
 */
export interface CreateUserRequest {
  readonly email: string;
  readonly username: string;
  readonly fullName: string;
  readonly password: string;
  readonly organizationId: string;
  readonly isActive?: boolean;
  readonly isSuperuser?: boolean;
}


/**
 * Update user request.
 */
export interface UpdateUserRequest {
  readonly username?: string;
  readonly fullName?: string;
  readonly email?: string;
  readonly isActive?: boolean;
  readonly isSuperuser?: boolean;
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
   * Active status filter.
   */
  readonly isActive?: boolean;
}


/**
 * User list query.
 */
export interface UserListQuery {
  readonly page?: number;
  readonly pageSize?: number;
  readonly filters?: UserFilterValues;
}


/**
 * Paginated user response.
 *
 * Matches backend/app/users/schemas.py UserListResponse.
 */
export interface UserListResponse {
  readonly users: readonly User[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}


/**
 * User statistics.
 */
export interface UserStatistics {
  readonly total: number;
  readonly active: number;
  readonly inactive: number;
}

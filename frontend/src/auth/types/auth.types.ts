/**
 * Authentication domain types.
 *
 * Defines TypeScript models used by the authentication
 * and authorization layers.
 */

import type { LoginRequest } from "../api/auth.api";

import type {
  UserSchemaType,
} from "../../features/users/schemas/user.schema";

/**
 * Authenticated user.
 *
 * Reuses the application's canonical user model.
 */
export type AuthUser = UserSchemaType;

/**
 * Authentication state.
 */
export interface AuthState {
  /**
   * Currently authenticated user.
   */
  readonly user: AuthUser | null;

  /**
   * Whether the user is authenticated.
   */
  readonly isAuthenticated: boolean;

  /**
   * Whether an authentication operation is in progress.
   */
  readonly isLoading: boolean;

  /**
   * Authenticates a user.
   *
   * @param credentials - Login credentials.
   */
  readonly login: (
    credentials: LoginRequest,
  ) => Promise<void>;

  /**
   * Logs out the current user.
   */
  readonly logout: () => Promise<void>;

  /**
   * Updates the authenticated user.
   *
   * @param user - Authenticated user or null.
   */
  readonly setUser: (
    user: AuthUser | null,
  ) => void;
}

/**
 * Authentication response containing
 * the authenticated user.
 */
export interface AuthResponse {
  /**
   * Authenticated user.
   */
  readonly user: AuthUser;
}

/**
 * Authentication context exposed to
 * application components.
 */
export interface AuthContextValue
  extends AuthState {
  /**
   * Whether authentication initialization
   * has completed.
   */
  readonly isInitialized: boolean;
}
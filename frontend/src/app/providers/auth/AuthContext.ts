/**
 * Authentication context.
 */

import {
  createContext,
} from "react";

/**
 * Authenticated user.
 */
export interface AuthUser {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * Full name.
   */
  readonly name: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * User role.
   */
  readonly role: string;
}

/**
 * Authentication context value.
 */
export interface AuthContextValue {
  /**
   * Authenticated user.
   */
  readonly user: AuthUser | null;

  /**
   * Authentication state.
   */
  readonly isAuthenticated: boolean;

  /**
   * Loading state.
   */
  readonly isLoading: boolean;

  /**
   * Sign in.
   */
  login(
    accessToken: string,
    refreshToken: string,
  ): Promise<void>;

  /**
   * Sign out.
   */
  logout(): Promise<void>;

  /**
   * Refresh current user.
   */
  refreshUser(): Promise<void>;
}

/**
 * Authentication context.
 */
export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );
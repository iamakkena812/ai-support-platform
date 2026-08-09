/**
 * Authentication context.
 */

import {
  createContext,
} from "react";

import type {
  UserSchemaType,
} from "../../../features/users/schemas/user.schema";

/**
 * Authenticated user.
 *
 * Reuses the application's shared user model.
 */
export type AuthUser = UserSchemaType;

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
   * Signs in the current user.
   *
   * @param accessToken - JWT access token.
   * @param refreshToken - JWT refresh token.
   */
  readonly login: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;

  /**
   * Signs out the current user.
   */
  readonly logout: () => Promise<void>;

  /**
   * Reloads the authenticated user.
   */
  readonly refreshUser: () => Promise<void>;
}

/**
 * Authentication context.
 */
export const AuthContext =
  createContext<AuthContextValue | null>(null);

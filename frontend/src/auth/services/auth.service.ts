/**
 * Authentication service.
 *
 * Coordinates authentication workflows.
 */

import {
  authApi,
  type LoginRequest,
  type LoginResponse,
} from "../api/auth.api";

import type { AuthResponse } from "../types/auth.types";

import {
  tokenService,
} from "./token.service";

/**
 * Authentication service.
 */
export class AuthService {
  /**
   * Authenticates a user.
   *
   * @param credentials - Login credentials.
   * @returns Authentication response.
   */
  async login(
    credentials: LoginRequest,
  ): Promise<LoginResponse> {
    const response = await authApi.login(
      credentials,
    );

    this.storeTokens(response);

    return response;
  }

  /**
   * Logs out the current user.
   */
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refreshes authentication tokens.
   *
   * @returns Updated authentication response.
   */
  async refresh(): Promise<LoginResponse> {
    const response = await authApi.refresh();

    this.storeTokens(response);

    return response;
  }

  /**
   * Retrieves the authenticated user profile.
   *
   * @returns Current authenticated user profile.
   */
  async profile(): Promise<AuthResponse> {
    return authApi.profile();
  }

  /**
   * Indicates whether the user is authenticated.
   *
   * @returns True when an access token exists.
   */
  isAuthenticated(): boolean {
    return tokenService.hasAccessToken();
  }

  /**
   * Persists authentication tokens.
   *
   * @param response - Authentication response.
   */
  private storeTokens(
    response: LoginResponse,
  ): void {
    this.clearTokens();

    tokenService.setAccessToken(
      response.access_token,
    );

    if (
      response.refresh_token != null &&
      response.refresh_token.length > 0
    ) {
      tokenService.setRefreshToken(
        response.refresh_token,
      );
    }
  }

  /**
   * Removes persisted authentication tokens.
   */
  private clearTokens(): void {
    tokenService.clearTokens();
  }
}

/**
 * Shared authentication service instance.
 */
export const authService = new AuthService();

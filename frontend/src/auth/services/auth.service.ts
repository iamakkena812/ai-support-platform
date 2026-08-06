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
import { tokenService } from "./token.service";

/**
 * Authentication service.
 */
export class AuthService {
  /**
   * Authenticates a user.
   *
   * @param credentials Login credentials.
   * @returns Login response.
   */
  async login(
    credentials: LoginRequest,
  ): Promise<LoginResponse> {
    const response =
      await authApi.login(
        credentials,
      );

    tokenService.setAccessToken(
      response.access_token,
    );

    if (
      response.refresh_token
    ) {
      tokenService.setRefreshToken(
        response.refresh_token,
      );
    }

    return response;
  }
  /**
   * Logs out the current user.
   */
  async logout(): Promise<void> {
    await authApi.logout();

    tokenService.clearTokens();
  }

  /**
   * Refreshes authentication tokens.
   *
   * @returns Updated login response.
   */
  async refresh(): Promise<LoginResponse> {
    const response = await authApi.refresh();

    tokenService.setAccessToken(
      response.access_token,
    );

    if (
      response.refresh_token
    ) {
      tokenService.setRefreshToken(
        response.refresh_token,
      );
    }

    return response;
  }

  /**
   * Returns the authenticated user profile.
   *
   * @returns Current user profile.
   */
  async profile<T>(): Promise<T> {
    return authApi.profile<T>();
  }

  /**
   * Returns whether an access token exists.
   *
   * @returns Authentication status.
   */
  isAuthenticated(): boolean {
    return tokenService.hasAccessToken();
  }
}

/**
 * Shared authentication service instance.
 */
export const authService = new AuthService();
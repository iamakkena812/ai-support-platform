/**
 * Authentication API.
 *
 * Provides HTTP methods for authentication endpoints.
 */

import { API_ENDPOINTS } from "../../api/endpoints";
import { apiService } from "../../services";

import type { AuthResponse } from "../types/auth.types";

/**
 * Login request.
 */
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

/**
 * Login response.
 */
export interface LoginResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly refresh_token?: string;
}

/**
 * Authentication API.
 */
export class AuthApi {
  /**
   * Authenticates a user.
   *
   * @param payload - Login credentials.
   * @returns Authentication response.
   */
  async login(
    payload: LoginRequest,
  ): Promise<LoginResponse> {
    return apiService.post<LoginResponse, LoginRequest>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
  }

  /**
   * Logs out the current user.
   */
  async logout(): Promise<void> {
    await apiService.post(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
  }

  /**
   * Refreshes the access token.
   *
   * @returns Authentication response.
   */
  async refresh(): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
    );
  }

  /**
   * Returns the authenticated user profile.
   *
   * @returns Authenticated user profile.
   */
  async profile(): Promise<AuthResponse> {
    return apiService.get<AuthResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
    );
  }
}

/**
 * Shared authentication API instance.
 */
export const authApi = new AuthApi();
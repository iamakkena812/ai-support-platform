/**
 * Token service.
 *
 * Manages authentication token persistence.
 */

import { authStorage } from "../../lib/auth";

/**
 * Token service.
 */
export class TokenService {
  /**
   * Stores the access token.
   *
   * @param token JWT access token.
   */
  setAccessToken(token: string): void {
    authStorage.setAccessToken(token);
  }

  /**
   * Returns the access token.
   *
   * @returns JWT access token.
   */
  getAccessToken(): string | null {
    return authStorage.getAccessToken();
  }

  /**
   * Removes the access token.
   */
  removeAccessToken(): void {
    authStorage.removeAccessToken();
  }

  /**
   * Stores the refresh token.
   *
   * @param token Refresh token.
   */
  setRefreshToken(token: string): void {
    authStorage.setRefreshToken(token);
  }

  /**
   * Returns the refresh token.
   *
   * @returns Refresh token.
   */
  getRefreshToken(): string | null {
    return authStorage.getRefreshToken();
  }

  /**
   * Removes the refresh token.
   */
  removeRefreshToken(): void {
    authStorage.removeRefreshToken();
  }

  /**
   * Removes every stored authentication token.
   */
  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  /**
   * Indicates whether an access token exists.
   *
   * @returns True when authenticated.
   */
  hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }
}

/**
 * Shared token service instance.
 */
export const tokenService = new TokenService();
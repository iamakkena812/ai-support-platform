/**
 * Authentication storage utilities.
 *
 * Provides helper methods for storing and retrieving
 * authentication-related data.
 */

import { storage } from "./storage";

/**
 * Storage keys.
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  CURRENT_USER: "current_user",
} as const;

/**
 * Authentication storage service.
 */
export class AuthStorage {
  /**
   * Stores the access token.
   *
   * @param token JWT access token.
   */
  setAccessToken(token: string): void {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Returns the access token.
   *
   * @returns JWT access token.
   */
  getAccessToken(): string | null {
    return storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Removes the access token.
   */
  removeAccessToken(): void {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Stores the refresh token.
   *
   * @param token Refresh token.
   */
  setRefreshToken(token: string): void {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Returns the refresh token.
   *
   * @returns Refresh token.
   */
  getRefreshToken(): string | null {
    return storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Removes the refresh token.
   */
  removeRefreshToken(): void {
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Stores the current user.
   *
   * @param user Current authenticated user.
   */
  setCurrentUser<T>(user: T): void {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  /**
   * Returns the current user.
   *
   * @returns Current authenticated user.
   */
  getCurrentUser<T>(): T | null {
    return storage.get<T>(STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Removes the current user.
   */
  removeCurrentUser(): void {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Clears all authentication data.
   */
  clear(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeCurrentUser();
  }
}

/**
 * Shared authentication storage instance.
 */
export const authStorage = new AuthStorage();
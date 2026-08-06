/**
 * Authentication store.
 *
 * Global authentication state managed by Zustand.
 */

import { create } from "zustand";

import {
  authService,
} from "../auth/services/auth.service";
import type {
  LoginRequest,
} from "../auth/api/auth.api";

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly roles: readonly string[];
}

export interface AuthState {
  readonly user: AuthUser | null;

  readonly isAuthenticated: boolean;

  readonly isLoading: boolean;

  login(
    credentials: LoginRequest,
  ): Promise<void>;

  logout(): Promise<void>;

  setUser(
    user: AuthUser | null,
  ): void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    isAuthenticated: authService.isAuthenticated(),

    isLoading: false,

    async login(credentials) {
      set({
        isLoading: true,
      });

      try {
        await authService.login(credentials);

        set({
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({
          isAuthenticated: false,
          isLoading: false,
        });

        throw error;
      }
    },

    async logout() {
      await authService.logout();

      set({
        user: null,
        isAuthenticated: false,
      });
    },

    setUser(user) {
      set({
        user,
      });
    },
  }));
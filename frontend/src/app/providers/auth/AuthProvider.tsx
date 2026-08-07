/**
 * Authentication provider.
 */

import axios from "axios";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  PropsWithChildren,
} from "react";

import {
  authService,
} from "../../../auth/services/auth.service";

import {
  tokenService,
} from "../../../auth/services/token.service";

import {
  AuthContext,
} from "./AuthContext";

import type {
  AuthContextValue,
  AuthUser,
} from "./AuthContext";

/**
 * Authentication provider.
 *
 * @param props Provider properties.
 * @returns Authentication provider.
 */
export function AuthProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /**
   * Loads the authenticated user.
   */
  const refreshUser =
    useCallback(
      async (): Promise<void> => {
        if (
          !authService.isAuthenticated()
        ) {
          setUser(null);

          return;
        }

        try {
          const profile =
            await authService.profile<AuthUser>();

          setUser(profile);
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            error.response?.status === 401
          ) {
            await authService.logout();

            setUser(null);

            return;
          }

          console.error(
            "Failed to load authenticated user.",
            error,
          );

          setUser(null);
        }
      },
      [],
    );

  /**
   * Restore authentication state.
   */
  useEffect(() => {
  async function initialize(): Promise<void> {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);

      return;
    }

    try {
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  }

  void initialize();
}, [refreshUser]);

  /**
   * Signs in the current user.
   */
  const login =
    useCallback(
      async (
        accessToken: string,
        refreshToken: string,
      ): Promise<void> => {
        tokenService.setAccessToken(
          accessToken,
        );

        if (refreshToken.length > 0) {
          tokenService.setRefreshToken(
            refreshToken,
          );
        }

        await refreshUser();
      },
      [refreshUser],
    );

  /**
   * Signs out the current user.
   */
  const logout =
    useCallback(
      async (): Promise<void> => {
        await authService.logout();

        setUser(null);
      },
      [],
    );

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        isAuthenticated:
          user !== null,
        isLoading,
        login,
        logout,
        refreshUser,
      }),
      [
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}
/**
 * Authentication provider.
 */

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";

import type {
  AuthUser,
  AuthContextValue,
} from "./AuthContext";

import type {
  PropsWithChildren,
} from "react";

/**
 * Authentication provider.
 */
export function AuthProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  /**
   * Sign in.
   */
  const login = useCallback(
    async (
      accessToken: string,
      refreshToken: string,
    ): Promise<void> => {
      void accessToken;
      void refreshToken;

      setIsLoading(true);

      try {
        // TODO:
        // Persist tokens.
        // Fetch current user.
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Sign out.
   */
  const logout = useCallback(
    async (): Promise<void> => {
      setUser(null);

      // TODO:
      // Remove persisted tokens.
    },
    [],
  );

  /**
   * Refresh authenticated user.
   */
  const refreshUser =
    useCallback(
      async (): Promise<void> => {
        // TODO:
        // Load current user profile.
      },
      [],
    );

  const value = useMemo<AuthContextValue>(
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
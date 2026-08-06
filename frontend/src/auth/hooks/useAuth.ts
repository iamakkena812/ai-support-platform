/**
 * Authentication hook.
 *
 * Provides authentication state and actions to
 * React components.
 */

import { useAuthStore } from "../../stores/auth.store";

/**
 * Returns the authentication store.
 *
 * @returns Authentication state and actions.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  const login = useAuthStore(
    (state) => state.login,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };
}
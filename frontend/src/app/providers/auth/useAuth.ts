/**
 * Authentication hook.
 */

import { useContext } from "react";

import { AuthContext } from "./AuthContext";

import type { AuthContextValue } from "./AuthContext";

/**
 * Returns the authentication context.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      "useAuth must be used within an AuthProvider.",
    );
  }

  return context;
}
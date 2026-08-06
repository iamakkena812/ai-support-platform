/**
 * Theme hook.
 */

import { useContext } from "react";

import { ThemeContext } from "./ThemeContext";

import type {
  ThemeContextValue,
} from "./ThemeContext";

/**
 * Returns the current theme context.
 */
export function useTheme(): ThemeContextValue {
  const context =
    useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      "useTheme must be used within a ThemeProvider.",
    );
  }

  return context;
}
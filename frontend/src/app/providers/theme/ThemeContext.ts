/**
 * Theme context.
 */

import { createContext } from "react";

/**
 * Available application themes.
 */
export type Theme = "light" | "dark";

/**
 * Theme context value.
 */
export interface ThemeContextValue {
  /**
   * Current theme.
   */
  readonly theme: Theme;

  /**
   * Change theme.
   */
  setTheme(theme: Theme): void;

  /**
   * Toggle theme.
   */
  toggleTheme(): void;
}

/**
 * Theme context.
 */
export const ThemeContext =
  createContext<ThemeContextValue | null>(
    null,
  );
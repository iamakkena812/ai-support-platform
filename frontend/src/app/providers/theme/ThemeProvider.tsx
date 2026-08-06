/**
 * Theme provider.
 */

import type { PropsWithChildren } from "react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ThemeContext,
} from "./ThemeContext";

import type {
  Theme,
  ThemeContextValue,
} from "./ThemeContext";

const STORAGE_KEY = "app-theme";

/**
 * Theme provider.
 */
export function ThemeProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [theme, setThemeState] =
    useState<Theme>("light");

  useEffect(() => {
    const storedTheme =
      localStorage.getItem(
        STORAGE_KEY,
      ) as Theme | null;

    if (storedTheme !== null) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      STORAGE_KEY,
      theme,
    );
  }, [theme]);

  const setTheme = (
    value: Theme,
  ): void => {
    setThemeState(value);
  };

  const toggleTheme = (): void => {
    setThemeState((current) =>
      current === "light"
        ? "dark"
        : "light",
    );
  };

  const value =
    useMemo<ThemeContextValue>(
      () => ({
        theme,
        setTheme,
        toggleTheme,
      }),
      [theme],
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}
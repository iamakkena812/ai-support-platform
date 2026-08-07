/**
 * Theme toggle component.
 *
 * Switches between light, dark,
 * and system themes.
 */

import {
  Laptop,
  Moon,
  Sun,
} from "lucide-react";

/**
 * Available themes.
 */
export type Theme =
  | "light"
  | "dark"
  | "system";

/**
 * Component properties.
 */
export interface ThemeToggleProps {
  /**
   * Current theme.
   */
  readonly theme: Theme;

  /**
   * Theme change callback.
   *
   * @param theme Selected theme.
   */
  readonly onChange: (
    theme: Theme,
  ) => void;
}

/**
 * Theme toggle.
 *
 * @param props Component properties.
 * @returns Theme toggle component.
 */
export function ThemeToggle({
  theme,
  onChange,
}: ThemeToggleProps): React.JSX.Element {
  const buttonClass = (
    active: boolean,
  ): string =>
    [
      "flex items-center justify-center rounded-lg p-2 transition-colors",
      active
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100",
    ].join(" ");

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        aria-label="Light theme"
        onClick={() =>
          onChange("light")
        }
        className={buttonClass(
          theme === "light",
        )}
      >
        <Sun size={18} />
      </button>

      <button
        type="button"
        aria-label="Dark theme"
        onClick={() =>
          onChange("dark")
        }
        className={buttonClass(
          theme === "dark",
        )}
      >
        <Moon size={18} />
      </button>

      <button
        type="button"
        aria-label="System theme"
        onClick={() =>
          onChange("system")
        }
        className={buttonClass(
          theme === "system",
        )}
      >
        <Laptop size={18} />
      </button>
    </div>
  );
}
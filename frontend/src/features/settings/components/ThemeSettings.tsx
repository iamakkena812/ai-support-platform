/**
 * Theme settings component.
 *
 * Wired to the application's real theme system
 * (`app/providers/theme`), which already applies light/dark mode
 * app-wide -- not a fake, unpersisted preference. "System" is not an
 * option because the underlying `ThemeContext` only supports
 * `"light" | "dark"`.
 */

import type { ChangeEvent } from "react";

import type { Theme } from "../../../app/providers/theme/ThemeContext";

/**
 * Component properties.
 */
export interface ThemeSettingsProps {
  /**
   * Current theme.
   */
  readonly theme: Theme;

  /**
   * Invoked when the theme changes.
   *
   * @param theme - Selected theme.
   */
  readonly onChange: (theme: Theme) => void;
}

/**
 * Theme settings.
 *
 * @param props - Component properties.
 * @returns Theme settings component.
 */
export function ThemeSettings({
  theme,
  onChange,
}: ThemeSettingsProps): React.JSX.Element {
  /**
   * Handles theme selection.
   *
   * @param event - Change event.
   */
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as Theme);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Theme Settings
      </h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Application Theme
        </label>

        <select
          value={theme}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <p className="mt-3 text-sm text-gray-500">
          Applied immediately across the application.
        </p>
      </div>
    </section>
  );
}

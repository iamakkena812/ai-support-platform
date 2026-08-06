/**
 * Theme settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  ThemeMode,
  ThemeSettings as ThemeSettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface ThemeSettingsProps {
  /**
   * Theme settings.
   */
  readonly settings: ThemeSettingsModel;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the theme changes.
   *
   * @param settings - Updated theme settings.
   */
  readonly onChange: (
    settings: ThemeSettingsModel,
  ) => void;
}

/**
 * Theme settings.
 *
 * @param props - Component properties.
 * @returns Theme settings component.
 */
export function ThemeSettings({
  settings,
  disabled = false,
  onChange,
}: ThemeSettingsProps): React.JSX.Element {
  /**
   * Handles theme selection.
   *
   * @param event - Change event.
   */
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    onChange({
      mode:
        event.target
          .value as ThemeMode,
    });
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
          value={
            settings.mode
          }
          onChange={
            handleChange
          }
          disabled={
            disabled
          }
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
        >
          <option value="system">
            System Default
          </option>

          <option value="light">
            Light
          </option>

          <option value="dark">
            Dark
          </option>
        </select>

        <p className="mt-3 text-sm text-gray-500">
          Choose how the application
          appearance should be
          displayed.
        </p>
      </div>
    </section>
  );
}
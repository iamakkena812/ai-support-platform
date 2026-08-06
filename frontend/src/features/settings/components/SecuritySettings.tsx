/**
 * Security settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  SecuritySettings as SecuritySettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface SecuritySettingsProps {
  /**
   * Security settings.
   */
  readonly security: SecuritySettingsModel;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when settings change.
   *
   * @param security - Updated security settings.
   */
  readonly onChange: (
    security: SecuritySettingsModel,
  ) => void;
}

/**
 * Security settings.
 *
 * @param props - Component properties.
 * @returns Security settings component.
 */
export function SecuritySettings({
  security,
  disabled = false,
  onChange,
}: SecuritySettingsProps): React.JSX.Element {
  /**
   * Updates a field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof SecuritySettingsModel,
  >(
    field: K,
    value: SecuritySettingsModel[K],
  ): void => {
    onChange({
      ...security,
      [field]: value,
    });
  };

  /**
   * Handles checkbox changes.
   *
   * @param event - Change event.
   */
  const handleMfaChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateField(
      "mfaEnabled",
      event.target.checked,
    );
  };

  /**
   * Handles session timeout changes.
   *
   * @param event - Change event.
   */
  const handleSessionTimeoutChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateField(
      "sessionTimeout",
      Number(
        event.target.value,
      ),
    );
  };

  /**
   * Handles password expiry changes.
   *
   * @param event - Change event.
   */
  const handlePasswordExpiryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateField(
      "passwordExpiryDays",
      Number(
        event.target.value,
      ),
    );
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Security Settings
      </h2>

      <div className="space-y-6">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Enable Multi-Factor Authentication
          </span>

          <input
            type="checkbox"
            checked={
              security.mfaEnabled
            }
            onChange={
              handleMfaChange
            }
            disabled={
              disabled
            }
            className="h-5 w-5"
          />
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Session Timeout (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={
              security.sessionTimeout
            }
            onChange={
              handleSessionTimeoutChange
            }
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password Expiry (days)
          </label>

          <input
            type="number"
            min={1}
            value={
              security.passwordExpiryDays
            }
            onChange={
              handlePasswordExpiryChange
            }
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
      </div>
    </section>
  );
}
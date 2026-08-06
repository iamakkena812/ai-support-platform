/**
 * Notification settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  NotificationSettings as NotificationSettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface NotificationSettingsProps {
  /**
   * Notification settings.
   */
  readonly notifications: NotificationSettingsModel;

  /**
   * Indicates whether the form is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when settings change.
   *
   * @param notifications - Updated settings.
   */
  readonly onChange: (
    notifications: NotificationSettingsModel,
  ) => void;
}

/**
 * Notification settings.
 *
 * @param props - Component properties.
 * @returns Notification settings component.
 */
export function NotificationSettings({
  notifications,
  disabled = false,
  onChange,
}: NotificationSettingsProps): React.JSX.Element {
  /**
   * Updates a notification field.
   *
   * @param field - Field name.
   * @param checked - Checked value.
   */
  const updateField = <
    K extends keyof NotificationSettingsModel,
  >(
    field: K,
    checked: NotificationSettingsModel[K],
  ): void => {
    onChange({
      ...notifications,
      [field]: checked,
    });
  };

  /**
   * Creates a checkbox change handler.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (
      field: keyof NotificationSettingsModel,
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      updateField(
        field,
        event.target.checked,
      );
    };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Notification Settings
      </h2>

      <div className="space-y-5">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Email Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.emailEnabled
            }
            onChange={createChangeHandler(
              "emailEnabled",
            )}
            disabled={disabled}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Browser Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.browserEnabled
            }
            onChange={createChangeHandler(
              "browserEnabled",
            )}
            disabled={disabled}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            AI Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.aiEnabled
            }
            onChange={createChangeHandler(
              "aiEnabled",
            )}
            disabled={disabled}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Ticket Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.ticketEnabled
            }
            onChange={createChangeHandler(
              "ticketEnabled",
            )}
            disabled={disabled}
            className="h-5 w-5"
          />
        </label>
      </div>
    </section>
  );
}
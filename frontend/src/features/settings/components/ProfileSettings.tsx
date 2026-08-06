/**
 * Profile settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  ProfileSettings as ProfileSettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface ProfileSettingsProps {
  /**
   * Profile settings.
   */
  readonly profile: ProfileSettingsModel;

  /**
   * Indicates whether the form is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the profile changes.
   *
   * @param profile - Updated profile.
   */
  readonly onChange: (
    profile: ProfileSettingsModel,
  ) => void;
}

/**
 * Profile settings.
 *
 * @param props - Component properties.
 * @returns Profile settings component.
 */
export function ProfileSettings({
  profile,
  disabled = false,
  onChange,
}: ProfileSettingsProps): React.JSX.Element {
  /**
   * Updates a profile field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof ProfileSettingsModel,
  >(
    field: K,
    value: ProfileSettingsModel[K],
  ): void => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  /**
   * Handles input changes.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (
      field: keyof ProfileSettingsModel,
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      updateField(
        field,
        event.target.value,
      );
    };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Profile Settings
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            value={
              profile.fullName
            }
            onChange={createChangeHandler(
              "fullName",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={
              profile.email
            }
            onChange={createChangeHandler(
              "email",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Job Title
          </label>

          <input
            type="text"
            value={
              profile.jobTitle ??
              ""
            }
            onChange={createChangeHandler(
              "jobTitle",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="tel"
            value={
              profile.phoneNumber ??
              ""
            }
            onChange={createChangeHandler(
              "phoneNumber",
            )}
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
/**
 * Profile settings component.
 *
 * Binds only to fields that actually exist on the real `User` model
 * (backend/app/users/schemas.py) -- job title, phone number, and avatar
 * are not supported by the current architecture and are not shown.
 */

import type { ChangeEvent } from "react";

import type { User } from "../../users/types/user.types";

/**
 * Editable profile fields.
 */
export interface ProfileFormValues {
  readonly fullName: string;
  readonly email: string;
  readonly username: string;
}

/**
 * Component properties.
 */
export interface ProfileSettingsProps {
  /**
   * Current user.
   */
  readonly profile: User;

  /**
   * Editable form values.
   */
  readonly values: ProfileFormValues;

  /**
   * Indicates whether the form is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when a field changes.
   *
   * @param values - Updated form values.
   */
  readonly onChange: (values: ProfileFormValues) => void;
}

/**
 * Profile settings.
 *
 * @param props - Component properties.
 * @returns Profile settings component.
 */
export function ProfileSettings({
  profile,
  values,
  disabled = false,
  onChange,
}: ProfileSettingsProps): React.JSX.Element {
  /**
   * Creates an input change handler for a field.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (field: keyof ProfileFormValues) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...values, [field]: event.target.value });
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
            value={values.fullName}
            onChange={createChangeHandler("fullName")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={values.email}
            onChange={createChangeHandler("email")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            value={values.username}
            onChange={createChangeHandler("username")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Role
          </span>

          <p className="px-3 py-2 text-sm text-gray-500">
            {profile.isSuperuser ? "Superuser" : "Member"}
          </p>
        </div>
      </div>
    </section>
  );
}

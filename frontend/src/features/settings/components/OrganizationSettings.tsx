/**
 * Organization settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  OrganizationSettings as OrganizationSettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface OrganizationSettingsProps {
  /**
   * Organization settings.
   */
  readonly organization: OrganizationSettingsModel;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the organization settings change.
   *
   * @param organization - Updated organization settings.
   */
  readonly onChange: (
    organization: OrganizationSettingsModel,
  ) => void;
}

/**
 * Organization settings.
 *
 * @param props - Component properties.
 * @returns Organization settings component.
 */
export function OrganizationSettings({
  organization,
  disabled = false,
  onChange,
}: OrganizationSettingsProps): React.JSX.Element {
  /**
   * Updates a field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof OrganizationSettingsModel,
  >(
    field: K,
    value: OrganizationSettingsModel[K],
  ): void => {
    onChange({
      ...organization,
      [field]: value,
    });
  };

  /**
   * Creates an input change handler.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (
      field: keyof OrganizationSettingsModel,
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
        Organization Settings
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Organization Name
          </label>

          <input
            type="text"
            value={
              organization.name
            }
            onChange={createChangeHandler(
              "name",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Domain
          </label>

          <input
            type="text"
            value={
              organization.domain ??
              ""
            }
            onChange={createChangeHandler(
              "domain",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Support Email
          </label>

          <input
            type="email"
            value={
              organization.supportEmail ??
              ""
            }
            onChange={createChangeHandler(
              "supportEmail",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Time Zone
          </label>

          <input
            type="text"
            value={
              organization.timeZone
            }
            onChange={createChangeHandler(
              "timeZone",
            )}
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Language
          </label>

          <input
            type="text"
            value={
              organization.language
            }
            onChange={createChangeHandler(
              "language",
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
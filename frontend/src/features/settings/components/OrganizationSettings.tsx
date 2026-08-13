/**
 * Organization settings component.
 *
 * Binds only to fields that actually exist on the real `Organization`
 * model (backend/app/organizations/schemas.py) -- "domain" and
 * "language" are not supported by the current architecture and are
 * not shown. Only organization administrators (superusers) can view
 * or update this via the backend (`CurrentSuperuserDependency` on
 * `GET/PATCH /organizations/{id}`), so this section is only rendered
 * for superusers -- see `SettingsPage`.
 */

import type { ChangeEvent } from "react";

import type { UpdateOrganizationRequest } from "../../organizations/types/organization.types";

/**
 * Component properties.
 */
export interface OrganizationSettingsProps {
  /**
   * Editable organization fields.
   */
  readonly values: UpdateOrganizationRequest;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when a field changes.
   *
   * @param values - Updated organization fields.
   */
  readonly onChange: (values: UpdateOrganizationRequest) => void;
}

/**
 * Organization settings.
 *
 * @param props - Component properties.
 * @returns Organization settings component.
 */
export function OrganizationSettings({
  values,
  disabled = false,
  onChange,
}: OrganizationSettingsProps): React.JSX.Element {
  /**
   * Creates an input change handler for a field.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (field: keyof UpdateOrganizationRequest) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...values, [field]: event.target.value });
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
            value={values.name ?? ""}
            onChange={createChangeHandler("name")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Code
          </label>

          <input
            type="text"
            value={values.code ?? ""}
            onChange={createChangeHandler("code")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Contact Email
          </label>

          <input
            type="email"
            value={values.email ?? ""}
            onChange={createChangeHandler("email")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Contact Phone
          </label>

          <input
            type="text"
            value={values.phone ?? ""}
            onChange={createChangeHandler("phone")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Website
          </label>

          <input
            type="text"
            value={values.website ?? ""}
            onChange={createChangeHandler("website")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Time Zone
          </label>

          <input
            type="text"
            value={values.timezone ?? ""}
            onChange={createChangeHandler("timezone")}
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
      </div>
    </section>
  );
}

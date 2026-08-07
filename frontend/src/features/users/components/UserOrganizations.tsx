/**
 * User organizations component.
 *
 * Displays the organizations
 * associated with a user.
 */

import {
  ArrowRight,
  Building2,
} from "lucide-react";

/**
 * Organization.
 */
export interface UserOrganization {
  /**
   * Organization identifier.
   */
  readonly id: string;

  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization code.
   */
  readonly code: string;

  /**
   * Organization status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface UserOrganizationsProps {
  /**
   * Organizations.
   */
  readonly organizations: readonly UserOrganization[];

  /**
   * View callback.
   */
  readonly onViewOrganization?: (
    organizationId: string,
  ) => void;
}

/**
 * Returns badge classes.
 *
 * @param status Organization status.
 * @returns CSS classes.
 */
function getStatusClass(
  status: string,
): string {
  switch (
    status.toUpperCase()
  ) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "INACTIVE":
      return "bg-slate-100 text-slate-700";

    case "SUSPENDED":
      return "bg-red-100 text-red-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

/**
 * User organizations.
 *
 * @param props Component properties.
 * @returns User organizations component.
 */
export function UserOrganizations({
  organizations,
  onViewOrganization,
}: UserOrganizationsProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Building2
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-slate-900">
          Organizations
        </h2>
      </div>

      {organizations.length === 0 ? (
        <p className="text-sm text-slate-500">
          No organizations assigned.
        </p>
      ) : (
        <div className="space-y-4">
          {organizations.map(
            (organization) => (
              <div
                key={organization.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {organization.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {organization.code}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getStatusClass(
                        organization.status,
                      ),
                    ].join(" ")}
                  >
                    {organization.status}
                  </span>

                  {onViewOrganization ? (
                    <button
                      type="button"
                      onClick={() =>
                        onViewOrganization(
                          organization.id,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      View

                      <ArrowRight
                        size={16}
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
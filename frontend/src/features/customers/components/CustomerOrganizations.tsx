/**
 * Customer organizations component.
 *
 * Displays organizations linked
 * to a customer.
 */

import {
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";

import {
  OrganizationStatusBadge,
} from "../../organizations/components";

/**
 * Customer organization.
 */
export interface CustomerOrganization {
  /**
   * Organization identifier.
   */
  readonly id: string;

  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization description.
   */
  readonly description?: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Organization status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface CustomerOrganizationsProps {
  /**
   * Customer organizations.
   */
  readonly organizations: readonly CustomerOrganization[];

  /**
   * View callback.
   */
  readonly onViewOrganization?: (
    organizationId: string,
  ) => void;
}

/**
 * Customer organizations component.
 *
 * @param props Component properties.
 * @returns Customer organizations.
 */
export function CustomerOrganizations({
  organizations,
  onViewOrganization,
}: CustomerOrganizationsProps): React.JSX.Element {
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
          No organizations linked to this customer.
        </p>
      ) : (
        <div className="space-y-4">
          {organizations.map(
            (organization) => (
              <div
                key={organization.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {organization.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {organization.description ??
                      "No description available."}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Users
                      size={16}
                    />

                    {organization.memberCount} member
                    {organization.memberCount === 1
                      ? ""
                      : "s"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <OrganizationStatusBadge
                    status={
                      organization.status
                    }
                  />

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
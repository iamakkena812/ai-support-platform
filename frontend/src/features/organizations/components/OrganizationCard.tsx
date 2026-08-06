/**
 * Organization card component.
 */

import { Building2 } from "lucide-react";

import type {
  Organization,
} from "../types/organization.types";

export interface OrganizationCardProps {
  /**
   * Organization.
   */
  readonly organization: Organization;

  /**
   * View callback.
   */
  readonly onView?: (
    organization: Organization,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    organization: Organization,
  ) => void;
}

/**
 * Organization card.
 */
export function OrganizationCard({
  organization,
  onView,
  onEdit,
}: OrganizationCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2
            className="text-blue-600"
            size={28}
          />

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {organization.name}
            </h2>

            <p className="text-sm text-slate-500">
              {organization.description ??
                "No description"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            organization.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {organization.isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      <div className="text-sm text-slate-500">
        Created

        {" "}

        {new Date(
          organization.createdAt,
        ).toLocaleDateString()}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() =>
            onView?.(organization)
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit?.(organization)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
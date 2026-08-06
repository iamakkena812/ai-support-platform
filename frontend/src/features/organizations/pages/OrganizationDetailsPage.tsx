/**
 * Organization details page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { useOrganization } from "../hooks/useOrganization";

/**
 * Organization details page.
 */
export function OrganizationDetailsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();

  const {
    data,
    isLoading,
    error,
  } = useOrganization(organizationId);

  if (isLoading) {
    return (
      <div className="p-8">
        Loading organization...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load organization.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Organization not found.
      </div>
    );
  }

  const organization = data.organization;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Organization Details
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
        >
          Back
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Name
            </h2>

            <p className="text-lg font-semibold">
              {organization.name}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Description
            </h2>

            <p>
              {organization.description ??
                "No description"}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Status
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
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

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Created
            </h2>

            <p>
              {new Date(
                organization.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Updated
            </h2>

            <p>
              {new Date(
                organization.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/organizations/${organization.id}/edit`,
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit Organization
          </button>
        </div>
      </div>
    </div>
  );
}
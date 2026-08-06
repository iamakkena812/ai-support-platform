/**
 * Team details page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { useTeam } from "../hooks/useTeam";

/**
 * Team details page.
 */
export function TeamDetailsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { teamId = "" } = useParams<{
    teamId: string;
  }>();

  const {
    data,
    isLoading,
    error,
  } = useTeam(teamId);

  if (isLoading) {
    return (
      <div className="p-8">
        Loading team...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load team.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Team not found.
      </div>
    );
  }

  const team = data.team;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Team Details
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
              {team.name}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Description
            </h2>

            <p>
              {team.description ??
                "No description"}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Organization ID
            </h2>

            <p>{team.organizationId}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Status
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                team.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {team.isActive
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
                team.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-500">
              Updated
            </h2>

            <p>
              {new Date(
                team.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/teams/${team.id}/edit`,
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit Team
          </button>
        </div>
      </div>
    </div>
  );
}
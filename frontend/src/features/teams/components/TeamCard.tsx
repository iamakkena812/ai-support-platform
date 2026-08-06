/**
 * Team card component.
 */

import { Users } from "lucide-react";

import type {
  Team,
} from "../types/team.types";

export interface TeamCardProps {
  /**
   * Team.
   */
  readonly team: Team;

  /**
   * View callback.
   */
  readonly onView?: (
    team: Team,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    team: Team,
  ) => void;
}

/**
 * Team card.
 */
export function TeamCard({
  team,
  onView,
  onEdit,
}: TeamCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users
            className="text-blue-600"
            size={28}
          />

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {team.name}
            </h2>

            <p className="text-sm text-slate-500">
              {team.description ??
                "No description"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
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

      <div className="space-y-2 text-sm text-slate-500">
        <p>
          Organization ID:
          {" "}
          {team.organizationId}
        </p>

        <p>
          Created:
          {" "}
          {new Date(
            team.createdAt,
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() =>
            onView?.(team)
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit?.(team)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
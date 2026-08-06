/**
 * Team table component.
 */

import type {
  Team,
} from "../types/team.types";

export interface TeamTableProps {
  /**
   * Teams.
   */
  readonly teams: readonly Team[];

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

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    team: Team,
  ) => void;
}

/**
 * Team table.
 */
export function TeamTable({
  teams,
  onView,
  onEdit,
  onDelete,
}: TeamTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Description
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Organization
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Created
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {teams.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-slate-500"
              >
                No teams found.
              </td>
            </tr>
          ) : (
            teams.map((team) => (
              <tr
                key={team.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">
                  {team.name}
                </td>

                <td className="px-6 py-4">
                  {team.description ?? "-"}
                </td>

                <td className="px-6 py-4">
                  {team.organizationId}
                </td>

                <td className="px-6 py-4">
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
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    team.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onView?.(team)
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(team)
                      }
                      className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete?.(team)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
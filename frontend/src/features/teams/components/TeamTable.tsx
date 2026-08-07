/**
 * Team table component.
 *
 * Displays teams in a responsive
 * table layout.
 */

import {
  TeamActions,
} from "./TeamActions";

import {
  TeamStatusBadge,
} from "./TeamStatusBadge";

/**
 * Team table row.
 */
export interface TeamTableRow {
  /**
   * Team identifier.
   */
  readonly id: string;

  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Organization.
   */
  readonly organization: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Project count.
   */
  readonly projectCount: number;

  /**
   * Status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface TeamTableProps {
  /**
   * Teams.
   */
  readonly teams: readonly TeamTableRow[];

  /**
   * View callback.
   */
  readonly onView?: (
    id: string,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    id: string,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    id: string,
  ) => void;
}

/**
 * Team table component.
 *
 * @param props Component properties.
 * @returns Team table.
 */
export function TeamTable({
  teams,
  onView,
  onEdit,
  onDelete,
}: TeamTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Team
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Organization
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Members
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Projects
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {teams.map(
              (team) => (
                <tr
                  key={team.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        {team.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium text-slate-900">
                        {team.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {team.organization}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-700">
                    {team.memberCount}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-700">
                    {team.projectCount}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <TeamStatusBadge
                      status={team.status}
                    />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <TeamActions
                      onView={
                        onView
                          ? () =>
                              onView(
                                team.id,
                              )
                          : undefined
                      }
                      onEdit={
                        onEdit
                          ? () =>
                              onEdit(
                                team.id,
                              )
                          : undefined
                      }
                      onDelete={
                        onDelete
                          ? () =>
                              onDelete(
                                team.id,
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
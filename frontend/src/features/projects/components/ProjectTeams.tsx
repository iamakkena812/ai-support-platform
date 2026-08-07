/**
 * Project teams component.
 *
 * Displays teams assigned
 * to a project.
 */

import {
  ArrowRight,
  Users,
} from "lucide-react";

import {
  TeamStatusBadge,
} from "../../teams/components";

/**
 * Project team.
 */
export interface ProjectTeam {
  /**
   * Team identifier.
   */
  readonly id: string;

  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Team description.
   */
  readonly description?: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Team status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface ProjectTeamsProps {
  /**
   * Assigned teams.
   */
  readonly teams: readonly ProjectTeam[];

  /**
   * View callback.
   */
  readonly onViewTeam?: (
    teamId: string,
  ) => void;
}

/**
 * Project teams component.
 *
 * @param props Component properties.
 * @returns Project teams component.
 */
export function ProjectTeams({
  teams,
  onViewTeam,
}: ProjectTeamsProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Users
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-slate-900">
          Assigned Teams
        </h2>
      </div>

      {teams.length === 0 ? (
        <p className="text-sm text-slate-500">
          No teams assigned to this project.
        </p>
      ) : (
        <div className="space-y-4">
          {teams.map(
            (team) => (
              <div
                key={team.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {team.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {team.description ??
                      "No description available."}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {team.memberCount} member
                    {team.memberCount === 1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <TeamStatusBadge
                    status={team.status}
                  />

                  {onViewTeam ? (
                    <button
                      type="button"
                      onClick={() =>
                        onViewTeam(
                          team.id,
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
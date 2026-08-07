/**
 * Customer projects component.
 *
 * Displays projects linked
 * to a customer.
 */

import {
  ArrowRight,
  FolderKanban,
  Users,
} from "lucide-react";

import {
  ProjectStatusBadge,
} from "../../projects/components";

/**
 * Customer project.
 */
export interface CustomerProject {
  /**
   * Project identifier.
   */
  readonly id: string;

  /**
   * Project name.
   */
  readonly name: string;

  /**
   * Project description.
   */
  readonly description?: string;

  /**
   * Team name.
   */
  readonly team: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Project progress.
   */
  readonly progress: number;

  /**
   * Project status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface CustomerProjectsProps {
  /**
   * Customer projects.
   */
  readonly projects: readonly CustomerProject[];

  /**
   * View callback.
   */
  readonly onViewProject?: (
    projectId: string,
  ) => void;
}

/**
 * Customer projects component.
 *
 * @param props Component properties.
 * @returns Customer projects.
 */
export function CustomerProjects({
  projects,
  onViewProject,
}: CustomerProjectsProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <FolderKanban
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-slate-900">
          Projects
        </h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-slate-500">
          No projects linked to this customer.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map(
            (project) => (
              <div
                key={project.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {project.name}
                    </h3>

                    <ProjectStatusBadge
                      status={
                        project.status
                      }
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {project.description ??
                      "No description available."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <Users
                        size={16}
                      />

                      {project.team}
                    </span>

                    <span>
                      {project.memberCount} member
                      {project.memberCount === 1
                        ? ""
                        : "s"}
                    </span>

                    <span>
                      Progress:{" "}
                      {project.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>
                </div>

                {onViewProject ? (
                  <button
                    type="button"
                    onClick={() =>
                      onViewProject(
                        project.id,
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
            ),
          )}
        </div>
      )}
    </section>
  );
}
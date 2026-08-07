/**
 * Organization projects component.
 *
 * Displays projects that belong
 * to an organization.
 */

import {
  ArrowRight,
  FolderKanban,
} from "lucide-react";

/**
 * Organization project.
 */
export interface OrganizationProject {
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
   * Project status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface OrganizationProjectsProps {
  /**
   * Organization projects.
   */
  readonly projects: readonly OrganizationProject[];

  /**
   * View project callback.
   */
  readonly onViewProject?: (
    projectId: string,
  ) => void;
}

/**
 * Returns status classes.
 *
 * @param status Project status.
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

    case "COMPLETED":
      return "bg-blue-100 text-blue-700";

    case "ARCHIVED":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

/**
 * Organization projects component.
 *
 * @param props Component properties.
 * @returns Organization projects component.
 */
export function OrganizationProjects({
  projects,
  onViewProject,
}: OrganizationProjectsProps): React.JSX.Element {
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
          No projects available.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map(
            (project) => (
              <div
                key={project.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {project.description ??
                      "No description available."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getStatusClass(
                        project.status,
                      ),
                    ].join(" ")}
                  >
                    {project.status}
                  </span>

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
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
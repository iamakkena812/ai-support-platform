/**
 * Recent projects component.
 */

import type {
  DashboardProject,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface RecentProjectsProps {
  /**
   * Recent projects.
   */
  readonly projects: readonly DashboardProject[];
}

/**
 * Returns Tailwind CSS classes for a project status.
 *
 * @param status - Project status.
 * @returns CSS classes.
 */
function getStatusClasses(
  status: string,
): string {
  switch (
    status.toLowerCase()
  ) {
    case "planning":
      return "bg-gray-100 text-gray-800";

    case "active":
      return "bg-blue-100 text-blue-800";

    case "on_hold":
    case "on hold":
      return "bg-yellow-100 text-yellow-800";

    case "completed":
      return "bg-green-100 text-green-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Recent projects.
 *
 * @param props - Component properties.
 * @returns Recent projects component.
 */
export function RecentProjects({
  projects,
}: RecentProjectsProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Projects
        </h2>
      </div>

      {projects.length ===
      0 ? (
        <div className="p-8 text-center text-gray-500">
          No recent projects.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {projects.map(
            (
              project,
            ) => (
              <div
                key={
                  project.id
                }
                className="space-y-3 px-6 py-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-gray-900">
                        {
                          project.name
                        }
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                          project.status,
                        )}`}
                      >
                        {
                          project.status
                        }
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Progress:{" "}
                      <span className="font-medium">
                        {
                          project.progress
                        }
                        %
                      </span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {project.startDate
                      ? new Date(
                          project.startDate,
                        ).toLocaleDateString()
                      : "No start date"}
                  </div>
                </div>

                <div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            project.progress,
                            100,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
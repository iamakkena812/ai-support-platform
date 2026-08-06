/**
 * Project table component.
 */

import type {
  Project,
} from "../types/project.types";

/**
 * Project table props.
 */
interface ProjectTableProject {
  readonly id: string;
  readonly name: string;
  readonly organizationId: string;
  readonly customerId: string;
  readonly status:
    | "planning"
    | "active"
    | "on_hold"
    | "completed"
    | "cancelled";
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly description?: string | null;
  readonly ownerId?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
}

interface ProjectTableProps {
  /**
   * Projects.
   */
  readonly projects: readonly ProjectTableProject[];

  /**
   * View callback.
   */
  readonly onView?: (
    project: ProjectTableProject,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    project: ProjectTableProject,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    project: ProjectTableProject,
  ) => void;
}

/**
 * Returns badge styles.
 *
 * @param status Project status.
 * @returns CSS classes.
 */
function getStatusColor(
  status: Project["status"],
): string {
  switch (status) {
    case "planning":
      return "bg-gray-100 text-gray-800";

    case "active":
      return "bg-green-100 text-green-800";

    case "on_hold":
      return "bg-yellow-100 text-yellow-800";

    case "completed":
      return "bg-blue-100 text-blue-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Project table.
 */
export function ProjectTable({
  projects,
  onView,
  onEdit,
  onDelete,
}: ProjectTableProps): React.JSX.Element {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
        No projects found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Customer
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Owner
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Start Date
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              End Date
            </th>

            <th className="px-4 py-3 text-right text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="font-medium">
                  {project.name}
                </div>

                <div className="text-sm text-gray-500">
                  {project.description ??
                    "No description"}
                </div>
              </td>

              <td className="px-4 py-3">
                {project.customerId}
              </td>

              <td className="px-4 py-3">
                {project.ownerId ??
                  "Unassigned"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                    project.status,
                  )}`}
                >
                  {project.status.replace(
                    "_",
                    " ",
                  )}
                </span>
              </td>

              <td className="px-4 py-3">
                {project.startDate ??
                  "-"}
              </td>

              <td className="px-4 py-3">
                {project.endDate ??
                  "-"}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <button
                      type="button"
                      onClick={() =>
                        onView(project)
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      View
                    </button>
                  )}

                  {onEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(project)
                      }
                      className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(project)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
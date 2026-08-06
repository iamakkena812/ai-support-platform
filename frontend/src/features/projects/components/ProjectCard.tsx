/**
 * Project card component.
 */

import type {
  Project,
} from "../types/project.types";

interface ProjectCardProps {
  /**
   * Project.
   */
  readonly project: Project;

  /**
   * View details callback.
   */
  readonly onView?: (
    project: Project,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    project: Project,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    project: Project,
  ) => void;
}

/**
 * Returns a badge color for a project status.
 *
 * @param status Project status.
 * @returns Tailwind CSS classes.
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
 * Project card.
 */
export function ProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps): React.JSX.Element {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {project.description ??
              "No description"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
            project.status,
          )}`}
        >
          {project.status.replace(
            "_",
            " ",
          )}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">
            Customer
          </span>

          <span>
            {project.customerId}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">
            Owner
          </span>

          <span>
            {project.ownerId ??
              "Unassigned"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">
            Start
          </span>

          <span>
            {project.startDate ??
              "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">
            End
          </span>

          <span>
            {project.endDate ??
              "-"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {onView && (
          <button
            type="button"
            onClick={() =>
              onView(project)
            }
            className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
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
            className="rounded bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600"
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
            className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
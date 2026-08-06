/**
 * Project details page.
 */

import { Link, useParams } from "react-router-dom";

import { useProject } from "../hooks/useProject";

/**
 * Project details page.
 */
export function ProjectDetailsPage(): React.JSX.Element {
  const { projectId = "" } =
    useParams<{
      projectId: string;
    }>();

  const {
    data,
    isLoading,
    isError,
  } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading project...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">
          Project not found.
        </p>

        <Link
          to="/projects"
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </Link>
      </div>
    );
  }

  const { project } = data;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {project.name}
          </h1>

          <p className="text-gray-600">
            Project Details
          </p>
        </div>

        <Link
          to="/projects"
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-6 md:grid-cols-2">
          <div>
            <dt className="font-semibold">
              Project Name
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.name}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Status
            </dt>

            <dd className="mt-1 capitalize text-gray-700">
              {project.status.replace(
                "_",
                " ",
              )}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Organization ID
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.organizationId}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Customer ID
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.customerId}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Owner ID
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.ownerId ??
                "Unassigned"}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Start Date
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.startDate ??
                "-"}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              End Date
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.endDate ??
                "-"}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">
              Created At
            </dt>

            <dd className="mt-1 text-gray-700">
              {project.createdAt}
            </dd>
          </div>

          <div className="md:col-span-2">
            <dt className="font-semibold">
              Description
            </dt>

            <dd className="mt-1 whitespace-pre-wrap text-gray-700">
              {project.description ??
                "No description provided."}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          to={`/projects/${project.id}/edit`}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          Edit
        </Link>

        <Link
          to="/projects"
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back to Projects
        </Link>
      </div>
    </section>
  );
}
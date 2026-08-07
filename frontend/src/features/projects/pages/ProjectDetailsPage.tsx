/**
 * Project details page.
 *
 * Displays detailed information about a project.
 */

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ProjectDetails,
  ProjectError,
  ProjectSkeleton,
} from "../components";

import {
  useDeleteProject,
  useProject,
} from "../hooks/useProject";


/**
 * Project details page.
 *
 * @returns Project details page component.
 */
export function ProjectDetailsPage(): React.JSX.Element {

  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();


  const {
    data: project,
    isLoading,
    isError,
    error,
  } =
    useProject(
      id,
    );


  const {
    mutateAsync:
      deleteProject,

    isPending:
      isDeleting,
  } =
    useDeleteProject();



  /**
   * Deletes current project.
   */
  async function handleDelete(): Promise<void> {

    await deleteProject(
      id,
    );


    navigate(
      "/projects",
    );

  }



  if (isLoading) {

    return (
      <ProjectSkeleton />
    );

  }



  if (isError) {

    return (

      <ProjectError
        message={
          error instanceof Error
            ? error.message
            : "Failed to load project."
        }
      />

    );

  }



  if (!project) {

    return (

      <ProjectError
        message="Project not found."
      />

    );

  }



  return (

    <div
      className="space-y-6"
    >

      <header
        className="flex items-center justify-between"
      >

        <div>

          <h1
            className="text-2xl font-bold text-slate-900"
          >
            Project Details
          </h1>


          <p
            className="mt-1 text-sm text-slate-600"
          >
            View project information and members.
          </p>

        </div>


        <div
          className="flex gap-3"
        >

          <Link
            to={`/projects/${project.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit Project
          </Link>


          <button
            type="button"
            disabled={
              isDeleting
            }
            onClick={
              handleDelete
            }
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >

            {
              isDeleting
                ? "Deleting..."
                : "Delete Project"
            }

          </button>

        </div>

      </header>



      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <ProjectDetails
          project={
            project
          }
        />

      </section>

    </div>

  );

}
/**
 * Edit project page.
 *
 * Provides project update functionality.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ProjectForm,
} from "../components";

import {
  useProject,
} from "../hooks/useProject";

import {
  useUpdateProject,
} from "../hooks/useProject";

import type {
  UpdateProjectRequest,
} from "../types/project.types";


/**
 * Edit project page.
 *
 * @returns Edit project page component.
 */
export function EditProjectPage(): React.JSX.Element {

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
  } =
    useProject(
      id,
    );


  const {
    mutateAsync:
      updateProject,

    isPending,
  } =
    useUpdateProject();



  /**
   * Handles project update.
   *
   * @param values Project update payload.
   */
  async function handleSubmit(
    values: UpdateProjectRequest,
  ): Promise<void> {

    await updateProject(
      {
        id,
        payload:
          values,
      },
    );


    navigate(
      `/projects/${id}`,
    );

  }



  if (isLoading) {

    return (

      <div
        className="text-sm text-slate-600"
      >
        Loading project...
      </div>

    );

  }



  if (!project) {

    return (

      <div
        className="text-sm text-slate-600"
      >
        Project not found.
      </div>

    );

  }



  return (

    <div
      className="space-y-6"
    >

      <header>

        <h1
          className="text-2xl font-bold text-slate-900"
        >
          Edit Project
        </h1>


        <p
          className="mt-1 text-sm text-slate-600"
        >
          Update project information.
        </p>

      </header>


      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <ProjectForm
          initialValue={
            project
          }

          onSubmit={
            handleSubmit
          }

          isSubmitting={
            isPending
          }
        />

      </section>

    </div>

  );

}
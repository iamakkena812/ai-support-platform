/**
 * Create project page.
 *
 * Provides project creation functionality.
 */

import {
  useNavigate,
} from "react-router-dom";

import {
  ProjectForm,
} from "../components";

import {
  useCreateProject,
} from "../hooks/useProjects";

import type {
  CreateProjectRequest,
} from "../types/project.types";


/**
 * Create project page.
 *
 * @returns Create project page component.
 */
export function CreateProjectPage(): React.JSX.Element {

  const navigate =
    useNavigate();


  const {
    mutateAsync:
      createProject,

    isPending,
  } =
    useCreateProject();


  /**
   * Handles project creation.
   *
   * @param values Project creation payload.
   */
  async function handleSubmit(
    values: CreateProjectRequest,
  ): Promise<void> {

    const project =
      await createProject(
        values,
      );


    navigate(
      `/projects/${project.id}`,
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
          Create Project
        </h1>


        <p
          className="mt-1 text-sm text-slate-600"
        >
          Create a new enterprise project.
        </p>

      </header>


      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <ProjectForm
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
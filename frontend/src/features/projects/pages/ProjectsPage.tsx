/**
 * Projects page.
 *
 * Displays paginated projects with filtering
 * and management actions.
 */

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ProjectEmpty,
  ProjectError,
  ProjectFilters,
  ProjectSkeleton,
  ProjectTable,
} from "../components";

import {
  useProjects,
} from "../hooks/useProjects";

import type {
  ProjectFilterValues,
  ProjectListQuery,
} from "../types/project.types";


/**
 * Projects page.
 *
 * @returns Projects page component.
 */
export function ProjectsPage(): React.JSX.Element {


  const navigate =
    useNavigate();


  const [
    query,
    setQuery,
  ] =
    useState<ProjectListQuery>(
      {
        page: 1,
        pageSize: 10,
      },
    );


  const {
    data,
    isLoading,
    isError,
    error,
  } =
    useProjects(
      query,
    );


  /**
   * Handles project filters.
   *
   * @param filters Project filters.
   */
  function handleFilters(
    filters: ProjectFilterValues,
  ): void {

    setQuery(
      {
        ...query,
        page: 1,
        filters,
      },
    );

  }


  /**
   * Handles project view.
   *
   * @param id Project identifier.
   */
  function handleView(
    id: string,
  ): void {

    navigate(
      `/projects/${id}`,
    );

  }


  /**
   * Handles project edit.
   *
   * @param id Project identifier.
   */
  function handleEdit(
    id: string,
  ): void {

    navigate(
      `/projects/${id}/edit`,
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
            : "Failed to load projects."
        }
      />

    );

  }


  if (
    !data ||
    data.items.length === 0
  ) {

    return (
      <ProjectEmpty />
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
            Projects
          </h1>


          <p
            className="mt-1 text-sm text-slate-600"
          >
            Manage enterprise projects and teams.
          </p>

        </div>


        <Link
          to="/projects/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Project
        </Link>

      </header>


      <ProjectFilters
        filters={
          query.filters
        }
        onChange={
          handleFilters
        }
      />


      <ProjectTable
        projects={
          data.items
        }
        onView={
          handleView
        }
        onEdit={
          handleEdit
        }
      />


      <div
        className="flex justify-between text-sm text-slate-600"
      >

        <span>
          Page {data.page} of {data.totalPages}
        </span>


        <span>
          Total Projects: {data.total}
        </span>

      </div>

    </div>

  );

}
/**
 * Project table component.
 *
 * Displays projects in a responsive table.
 */

import {
  ProjectActions,
} from "./ProjectActions";

import {
  ProjectStatusBadge,
} from "./ProjectStatusBadge";

import type {
  Project,
} from "../types/project.types";


/**
 * Component properties.
 */
export interface ProjectTableProps {

  /**
   * Projects.
   */
  readonly projects: readonly Project[];


  /**
   * View callback.
   */
  readonly onView?: (
    id: string,
  ) => void;


  /**
   * Edit callback.
   */
  readonly onEdit?: (
    id: string,
  ) => void;


  /**
   * Delete callback.
   */
  readonly onDelete?: (
    id: string,
  ) => void;

}


/**
 * Project table.
 *
 * @param props Component properties.
 * @returns Project table component.
 */
export function ProjectTable(
  {
    projects,
    onView,
    onEdit,
    onDelete,
  }: ProjectTableProps,
): React.JSX.Element {

  return (

    <div
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white"
    >

      <table
        className="w-full"
      >

        <thead
          className="bg-slate-50"
        >

          <tr>

            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Project
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Organization
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Priority
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Status
            </th>


            <th
              className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700"
            >
              Actions
            </th>

          </tr>

        </thead>


        <tbody
          className="divide-y divide-slate-200"
        >

          {
            projects.map(
              (
                project,
              ) => (

                <tr
                  key={
                    project.id
                  }
                  className="hover:bg-slate-50"
                >

                  <td
                    className="px-6 py-4"
                  >

                    <div
                      className="font-medium text-slate-900"
                    >
                      {
                        project.name
                      }
                    </div>


                    {
                      project.description && (

                        <div
                          className="mt-1 text-sm text-slate-500"
                        >
                          {
                            project.description
                          }
                        </div>

                      )
                    }

                  </td>


                  <td
                    className="px-6 py-4 text-sm text-slate-700"
                  >

                    {
                      project.organization?.name ??
                      "-"
                    }

                  </td>


                  <td
                    className="px-6 py-4 text-sm text-slate-700"
                  >

                    {
                      project.priority
                    }

                  </td>


                  <td
                    className="px-6 py-4"
                  >

                    <ProjectStatusBadge
                      status={
                        project.status
                      }
                    />

                  </td>


                  <td
                    className="px-6 py-4 text-right"
                  >

                    <ProjectActions
                      onView={
                        onView
                          ? () =>
                              onView(
                                project.id,
                              )
                          : undefined
                      }

                      onEdit={
                        onEdit
                          ? () =>
                              onEdit(
                                project.id,
                              )
                          : undefined
                      }

                      onDelete={
                        onDelete
                          ? () =>
                              onDelete(
                                project.id,
                              )
                          : undefined
                      }
                    />

                  </td>

                </tr>

              ),
            )
          }

        </tbody>

      </table>

    </div>

  );

}
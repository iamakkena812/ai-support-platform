/**
 * Project details component.
 *
 * Displays detailed information about a project.
 */

import {
  ProjectStatusBadge,
} from "./ProjectStatusBadge";

import type {
  Project,
} from "../types/project.types";


/**
 * Component properties.
 */
export interface ProjectDetailsProps {

  /**
   * Project entity.
   */
  readonly project: Project;

}


/**
 * Project details.
 *
 * @param props Component properties.
 * @returns Project details component.
 */
export function ProjectDetails(
  {
    project,
  }: ProjectDetailsProps,
): React.JSX.Element {

  return (

    <div
      className="space-y-6"
    >

      <div>

        <h2
          className="text-xl font-semibold text-slate-900"
        >
          {
            project.name
          }
        </h2>


        {
          project.description && (

            <p
              className="mt-2 text-sm text-slate-600"
            >
              {
                project.description
              }
            </p>

          )
        }

      </div>


      <div
        className="grid gap-4 md:grid-cols-2"
      >

        <div
          className="rounded-lg border border-slate-200 p-4"
        >

          <p
            className="text-sm text-slate-500"
          >
            Status
          </p>


          <div
            className="mt-2"
          >

            <ProjectStatusBadge
              status={
                project.status
              }
            />

          </div>

        </div>


        <div
          className="rounded-lg border border-slate-200 p-4"
        >

          <p
            className="text-sm text-slate-500"
          >
            Priority
          </p>


          <p
            className="mt-2 font-medium text-slate-900"
          >
            {
              project.priority
            }
          </p>

        </div>


        <div
          className="rounded-lg border border-slate-200 p-4"
        >

          <p
            className="text-sm text-slate-500"
          >
            Organization
          </p>


          <p
            className="mt-2 font-medium text-slate-900"
          >
            {
              project.organization?.name ??
              "-"
            }
          </p>

        </div>


        <div
          className="rounded-lg border border-slate-200 p-4"
        >

          <p
            className="text-sm text-slate-500"
          >
            Created
          </p>


          <p
            className="mt-2 font-medium text-slate-900"
          >
            {
              new Date(
                project.createdAt,
              ).toLocaleDateString()
            }
          </p>

        </div>

      </div>


      <div
        className="rounded-lg border border-slate-200 p-4"
      >

        <h3
          className="font-semibold text-slate-900"
        >
          Teams
        </h3>


        {
          project.teams.length > 0 ? (

            <ul
              className="mt-3 space-y-2"
            >

              {
                project.teams.map(
                  (
                    team,
                  ) => (

                    <li
                      key={
                        team.id
                      }
                      className="text-sm text-slate-700"
                    >
                      {
                        team.name
                      }
                    </li>

                  ),
                )
              }

            </ul>

          ) : (

            <p
              className="mt-2 text-sm text-slate-500"
            >
              No teams assigned.
            </p>

          )
        }

      </div>


      <div
        className="rounded-lg border border-slate-200 p-4"
      >

        <h3
          className="font-semibold text-slate-900"
        >
          Members
        </h3>


        {
          project.members.length > 0 ? (

            <ul
              className="mt-3 space-y-2"
            >

              {
                project.members.map(
                  (
                    member,
                  ) => (

                    <li
                      key={
                        member.id
                      }
                      className="text-sm text-slate-700"
                    >

                      <span
                        className="font-medium"
                      >
                        {
                          member.name
                        }
                      </span>

                      <span
                        className="ml-2 text-slate-500"
                      >
                        {
                          member.email
                        }
                      </span>

                    </li>

                  ),
                )
              }

            </ul>

          ) : (

            <p
              className="mt-2 text-sm text-slate-500"
            >
              No members assigned.
            </p>

          )
        }

      </div>


      <div
        className="grid gap-4 md:grid-cols-2"
      >

        <div>

          <p
            className="text-sm text-slate-500"
          >
            Start Date
          </p>


          <p
            className="mt-1 text-sm text-slate-900"
          >
            {
              project.startDate ?? "-"
            }
          </p>

        </div>


        <div>

          <p
            className="text-sm text-slate-500"
          >
            End Date
          </p>


          <p
            className="mt-1 text-sm text-slate-900"
          >
            {
              project.endDate ?? "-"
            }
          </p>

        </div>

      </div>


    </div>

  );

}
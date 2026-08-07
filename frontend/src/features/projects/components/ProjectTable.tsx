/**
 * Project table component.
 *
 * Displays projects in a
 * responsive table layout.
 */

import {
  Target,
} from "lucide-react";

import {
  ProjectActions,
} from "./ProjectActions";

import {
  ProjectStatusBadge,
} from "./ProjectStatusBadge";

/**
 * Project table row.
 */
export interface ProjectTableRow {
  /**
   * Project identifier.
   */
  readonly id: string;

  /**
   * Project name.
   */
  readonly name: string;

  /**
   * Organization.
   */
  readonly organization: string;

  /**
   * Team.
   */
  readonly team: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Progress.
   */
  readonly progress: number;

  /**
   * Status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface ProjectTableProps {
  /**
   * Projects.
   */
  readonly projects: readonly ProjectTableRow[];

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
 * Project table component.
 *
 * @param props Component properties.
 * @returns Project table.
 */
export function ProjectTable({
  projects,
  onView,
  onEdit,
  onDelete,
}: ProjectTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Project
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Organization
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Team
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Members
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Progress
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {projects.map(
              (project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        {project.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium text-slate-900">
                        {project.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {project.organization}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {project.team}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-700">
                    {project.memberCount}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Target
                        size={16}
                        className="text-blue-600"
                      />

                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <span className="w-12 text-right text-sm font-medium text-slate-700">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <ProjectStatusBadge
                      status={project.status}
                    />
                  </td>

                  <td className="px-6 py-4 text-right">
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
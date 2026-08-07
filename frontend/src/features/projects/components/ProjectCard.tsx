/**
 * Project card component.
 *
 * Displays project information
 * in a responsive card layout.
 */

import {
  Building2,
  FolderKanban,
  Target,
  Users,
} from "lucide-react";

import {
  ProjectActions,
} from "./ProjectActions";

import {
  ProjectStatusBadge,
} from "./ProjectStatusBadge";

/**
 * Component properties.
 */
export interface ProjectCardProps {
  /**
   * Project identifier.
   */
  readonly id: string;

  /**
   * Project name.
   */
  readonly name: string;

  /**
   * Project description.
   */
  readonly description?: string;

  /**
   * Organization name.
   */
  readonly organization: string;

  /**
   * Team name.
   */
  readonly team: string;

  /**
   * Progress percentage.
   */
  readonly progress: number;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Project status.
   */
  readonly status: string;

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
 * Project card component.
 *
 * @param props Component properties.
 * @returns Project card.
 */
export function ProjectCard({
  id,
  name,
  description,
  organization,
  team,
  progress,
  memberCount,
  status,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {name}
            </h3>

            <ProjectStatusBadge
              status={status}
            />
          </div>
        </div>

        <ProjectActions
          onView={
            onView
              ? () => onView(id)
              : undefined
          }
          onEdit={
            onEdit
              ? () => onEdit(id)
              : undefined
          }
          onDelete={
            onDelete
              ? () => onDelete(id)
              : undefined
          }
        />
      </div>

      {description ? (
        <p className="mt-5 text-sm leading-6 text-slate-600">
          {description}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Building2 size={16} />

          <span>{organization}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Users size={16} />

          <span>{team}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <FolderKanban size={16} />

          <span>
            {memberCount} Member
            {memberCount === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target
              size={16}
              className="text-blue-600"
            />

            <span className="text-sm font-medium text-slate-700">
              Progress
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-900">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
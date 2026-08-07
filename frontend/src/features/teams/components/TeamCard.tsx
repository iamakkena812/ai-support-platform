/**
 * Team card component.
 *
 * Displays team information
 * in a card layout.
 */

import {
  Building2,
  FolderKanban,
  Users,
} from "lucide-react";

import {
  TeamActions,
} from "./TeamActions";

import {
  TeamStatusBadge,
} from "./TeamStatusBadge";

/**
 * Component properties.
 */
export interface TeamCardProps {
  /**
   * Team identifier.
   */
  readonly id: string;

  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Description.
   */
  readonly description?: string;

  /**
   * Organization name.
   */
  readonly organization: string;

  /**
   * Team status.
   */
  readonly status: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Project count.
   */
  readonly projectCount: number;

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
 * Team card component.
 *
 * @param props Component properties.
 * @returns Team card component.
 */
export function TeamCard({
  id,
  name,
  description,
  organization,
  status,
  memberCount,
  projectCount,
  onView,
  onEdit,
  onDelete,
}: TeamCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {name}
              </h3>

              <TeamStatusBadge
                status={status}
              />
            </div>
          </div>
        </div>

        <TeamActions
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

          <span>
            {memberCount} Member
            {memberCount === 1
              ? ""
              : "s"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <FolderKanban
            size={16}
          />

          <span>
            {projectCount} Project
            {projectCount === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
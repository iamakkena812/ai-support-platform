/**
 * Project empty component.
 *
 * Displays an empty state when
 * no projects are available.
 */

import {
  FolderKanban,
  Plus,
} from "lucide-react";

/**
 * Component properties.
 */
export interface ProjectEmptyProps {
  /**
   * Empty state title.
   */
  readonly title?: string;

  /**
   * Empty state description.
   */
  readonly description?: string;

  /**
   * Action label.
   */
  readonly actionLabel?: string;

  /**
   * Action callback.
   */
  readonly onAction?: () => void;
}

/**
 * Project empty component.
 *
 * @param props Component properties.
 * @returns Project empty component.
 */
export function ProjectEmpty({
  title = "No Projects Found",
  description = "Create your first project to organize work, assign teams, and track progress.",
  actionLabel = "Create Project",
  onAction,
}: ProjectEmptyProps): React.JSX.Element {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <FolderKanban
            size={36}
            className="text-blue-600"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>

        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />

            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
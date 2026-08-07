/**
 * User header component.
 *
 * Displays the user page header
 * with title, description, and actions.
 */

import type {
  ReactNode,
} from "react";

import {
  UserRound,
} from "lucide-react";

/**
 * Component properties.
 */
export interface UserHeaderProps {
  /**
   * Page title.
   */
  readonly title?: string;

  /**
   * Page description.
   */
  readonly description?: string;

  /**
   * Header actions.
   */
  readonly actions?: ReactNode;
}

/**
 * User header.
 *
 * @param props Component properties.
 * @returns User header component.
 */
export function UserHeader({
  title = "Users",
  description = "Manage users across the Enterprise AI Support Platform.",
  actions,
}: UserHeaderProps): React.JSX.Element {
  return (
    <header className="mb-8 flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
          <UserRound
            size={28}
            className="text-blue-600"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {description}
          </p>
        </div>
      </div>

      {actions ? (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
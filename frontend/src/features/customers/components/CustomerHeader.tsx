/**
 * Customer header component.
 *
 * Displays the customer page header
 * with title, description, and actions.
 */

import type {
  ReactNode,
} from "react";

import {
  Users,
} from "lucide-react";

/**
 * Component properties.
 */
export interface CustomerHeaderProps {
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
 * Customer header component.
 *
 * @param props Component properties.
 * @returns Customer header component.
 */
export function CustomerHeader({
  title = "Customers",
  description = "Manage customers across the Enterprise AI Support Platform.",
  actions,
}: CustomerHeaderProps): React.JSX.Element {
  return (
    <header className="mb-8 flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
          <Users
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
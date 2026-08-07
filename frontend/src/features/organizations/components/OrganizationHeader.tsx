/**
 * Organization header component.
 *
 * Displays the organization page header
 * with title, description, and actions.
 */

import type {
  ReactNode,
} from "react";

import {
  Building2,
} from "lucide-react";

/**
 * Component properties.
 */
export interface OrganizationHeaderProps {
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
 * Organization header.
 *
 * @param props Component properties.
 * @returns Organization header component.
 */
export function OrganizationHeader({
  title = "Organizations",
  description = "Manage organizations across the Enterprise AI Support Platform.",
  actions,
}: OrganizationHeaderProps): React.JSX.Element {
  return (
    <header className="mb-8 flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
          <Building2
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
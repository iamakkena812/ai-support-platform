/**
 * Topbar component.
 *
 * Displays the page title and optional actions.
 */

import type { ReactNode } from "react";

export interface TopbarProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
}

/**
 * Topbar component.
 */
export function Topbar({
  title,
  subtitle,
  actions,
}: TopbarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
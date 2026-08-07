/**
 * Page header component.
 *
 * Displays a consistent page title, description
 * and optional page actions.
 */

import type {
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface PageHeaderProps {
  /**
   * Page title.
   */
  readonly title: string;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Optional actions.
   */
  readonly actions?: ReactNode;
}

/**
 * Page header component.
 *
 * @param props Component properties.
 * @returns Page header component.
 */
export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
/**
 * Dashboard section component.
 *
 * Provides a reusable container for
 * dashboard sections.
 */

import type {
  PropsWithChildren,
  ReactNode,
} from "react";

export interface DashboardSectionProps
  extends PropsWithChildren {
  /**
   * Section title.
   */
  readonly title?: string;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Optional actions.
   */
  readonly actions?: ReactNode;

  /**
   * Remove padding.
   */
  readonly noPadding?: boolean;
}

/**
 * Dashboard section.
 *
 * @param props Component properties.
 * @returns Dashboard section.
 */
export function DashboardSection({
  title,
  description,
  actions,
  noPadding = false,
  children,
}: DashboardSectionProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {(title ??
        description ??
        actions) && (
        <header className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-start md:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-1 text-sm text-slate-600">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          ) : null}
        </header>
      )}

      <div
        className={
          noPadding
            ? ""
            : "p-6"
        }
      >
        {children}
      </div>
    </section>
  );
}
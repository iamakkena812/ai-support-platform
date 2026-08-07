/**
 * Page container component.
 *
 * Provides a consistent wrapper for page content.
 */

import type {
  PropsWithChildren,
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface PageContainerProps
  extends PropsWithChildren {
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
 * Page container.
 *
 * @param props Component properties.
 * @returns Page container component.
 */
export function PageContainer({
  title,
  description,
  actions,
  children,
}: PageContainerProps): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {(title ?? description ?? actions) ? (
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            {title ? (
              <h1 className="text-3xl font-bold text-slate-900">
                {title}
              </h1>
            ) : null}

            {description ? (
              <p className="mt-2 text-sm text-slate-600">
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
      ) : null}

      <section>
        {children}
      </section>
    </div>
  );
}
/**
 * Page container component.
 *
 * Provides a consistent wrapper for page content.
 */

import type { PropsWithChildren, ReactNode } from "react";

export interface PageContainerProps
  extends PropsWithChildren {
  readonly title?: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

/**
 * Page container.
 */
export function PageContainer({
  title,
  description,
  actions,
  children,
}: PageContainerProps): React.JSX.Element {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      {(title || description || actions) && (
        <header className="flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2 className="text-3xl font-bold text-slate-900">
                {title}
              </h2>
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
      )}

      <div className="flex flex-1 flex-col gap-6">
        {children}
      </div>
    </section>
  );
}
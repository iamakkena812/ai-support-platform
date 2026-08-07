/**
 * Card component.
 *
 * Displays reusable card containers.
 */

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card title.
   */
  readonly title?: string;

  /**
   * Card description.
   */
  readonly description?: string;

  /**
   * Header actions.
   */
  readonly actions?: ReactNode;

  /**
   * Card footer.
   */
  readonly footer?: ReactNode;
}

/**
 * Card component.
 *
 * @param props Component properties.
 * @returns Card component.
 */
export function Card({
  title,
  description,
  actions,
  footer,
  children,
  className = "",
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={[
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {(title ??
        description ??
        actions) ? (
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
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
      ) : null}

      <div className="p-6">
        {children}
      </div>

      {footer ? (
        <footer className="border-t border-slate-200 px-6 py-4">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
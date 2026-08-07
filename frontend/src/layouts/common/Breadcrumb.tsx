/**
 * Breadcrumb component.
 *
 * Displays the current navigation path.
 */

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Breadcrumb item.
 */
export interface BreadcrumbItem {
  /**
   * Display label.
   */
  readonly label: string;

  /**
   * Navigation path.
   */
  readonly href?: string;
}

/**
 * Component properties.
 */
export interface BreadcrumbProps {
  /**
   * Breadcrumb items.
   */
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Breadcrumb component.
 *
 * @param props Component properties.
 * @returns Breadcrumb component.
 */
export function Breadcrumb({
  items,
}: BreadcrumbProps): React.JSX.Element {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm text-slate-500"
    >
      {items.map(
        (item, index) => {
          const isLast =
            index === items.length - 1;

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center"
            >
              {item.href &&
              !isLast ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-semibold text-slate-900"
                      : ""
                  }
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  size={16}
                  className="mx-2 text-slate-400"
                />
              ) : null}
            </div>
          );
        },
      )}
    </nav>
  );
}
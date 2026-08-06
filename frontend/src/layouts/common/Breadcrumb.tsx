/**
 * Breadcrumb component.
 *
 * Displays the current navigation path.
 */

import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface BreadcrumbProps {
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Breadcrumb component.
 */
export function Breadcrumb({
  items,
}: BreadcrumbProps): React.JSX.Element {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm text-slate-500"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center"
          >
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="transition-colors hover:text-slate-900"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium text-slate-900"
                    : ""
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight
                size={16}
                className="mx-2 text-slate-400"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
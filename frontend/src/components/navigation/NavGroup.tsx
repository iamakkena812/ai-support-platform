/**
 * Navigation group component.
 *
 * Displays a collapsible group of
 * navigation items.
 */

import type {
  PropsWithChildren,
} from "react";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  useState,
} from "react";

/**
 * Component properties.
 */
export interface NavGroupProps
  extends PropsWithChildren {
  /**
   * Group title.
   */
  readonly title: string;

  /**
   * Initially expanded.
   */
  readonly defaultExpanded?: boolean;

  /**
   * Optional icon.
   */
  readonly icon?: React.ReactNode;
}

/**
 * Navigation group.
 *
 * @param props Component properties.
 * @returns Navigation group.
 */
export function NavGroup({
  title,
  children,
  defaultExpanded = true,
  icon,
}: NavGroupProps): React.JSX.Element {
  const [
    expanded,
    setExpanded,
  ] = useState(
    defaultExpanded,
  );

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (previous) =>
              !previous,
          )
        }
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          {icon}

          <span>{title}</span>
        </div>

        {expanded ? (
          <ChevronDown
            size={18}
          />
        ) : (
          <ChevronRight
            size={18}
          />
        )}
      </button>

      {expanded ? (
        <div className="ml-4 space-y-1 border-l border-slate-200 pl-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}
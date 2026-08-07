/**
 * Dashboard grid component.
 *
 * Provides a responsive grid layout for
 * dashboard widgets.
 */

import type {
  PropsWithChildren,
} from "react";

export interface DashboardGridProps
  extends PropsWithChildren {
  /**
   * Number of columns on extra-large screens.
   */
  readonly columns?:
    | 2
    | 3
    | 4;

  /**
   * Gap between grid items.
   */
  readonly gap?:
    | 4
    | 6
    | 8;
}

/**
 * Dashboard grid.
 *
 * @param props Component properties.
 * @returns Dashboard grid component.
 */
export function DashboardGrid({
  children,
  columns = 4,
  gap = 6,
}: DashboardGridProps): React.JSX.Element {
  const columnClasses = {
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
  };

  const gapClasses = {
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  };

  return (
    <div
      className={[
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        columnClasses[
          columns
        ],
        gapClasses[gap],
      ].join(" ")}
    >
      {children}
    </div>
  );
}
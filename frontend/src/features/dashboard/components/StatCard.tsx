/**
 * Dashboard statistic card.
 */

import type { ReactNode } from "react";

export interface StatCardProps {
  /**
   * Card title.
   */
  readonly title: string;

  /**
   * Statistic value.
   */
  readonly value: number | string;

  /**
   * Optional icon.
   */
  readonly icon?: ReactNode;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Optional color class.
   */
  readonly colorClass?: string;
}

/**
 * Statistic card.
 */
export function StatCard({
  title,
  value,
  icon,
  description,
  colorClass = "bg-white",
}: StatCardProps): React.JSX.Element {
  return (
    <div
      className={`rounded-xl border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {description ? (
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-lg bg-slate-100 p-3">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
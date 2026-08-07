/**
 * Metric card component.
 *
 * Displays a reusable dashboard metric.
 */

import type {
  ReactNode,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

/**
 * Metric trend.
 */
export type MetricTrend =
  | "up"
  | "down"
  | "neutral";

/**
 * Component properties.
 */
export interface MetricCardProps {
  /**
   * Metric title.
   */
  readonly title: string;

  /**
   * Metric value.
   */
  readonly value: string | number;

  /**
   * Optional icon.
   */
  readonly icon?: ReactNode;

  /**
   * Trend direction.
   */
  readonly trend?: MetricTrend;

  /**
   * Trend label.
   */
  readonly trendLabel?: string;
}

/**
 * Returns trend icon.
 *
 * @param trend Trend direction.
 * @returns Trend icon.
 */
function getTrendIcon(
  trend: MetricTrend,
): React.JSX.Element {
  switch (trend) {
    case "up":
      return (
        <ArrowUpRight
          size={16}
          className="text-green-600"
        />
      );

    case "down":
      return (
        <ArrowDownRight
          size={16}
          className="text-red-600"
        />
      );

    default:
      return (
        <Minus
          size={16}
          className="text-slate-500"
        />
      );
  }
}

/**
 * Metric card component.
 *
 * @param props Component properties.
 * @returns Metric card component.
 */
export function MetricCard({
  title,
  value,
  icon,
  trend = "neutral",
  trendLabel,
}: MetricCardProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        {icon ? (
          <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
            {icon}
          </div>
        ) : null}
      </div>

      {trendLabel ? (
        <div className="mt-6 flex items-center gap-2 text-sm">
          {getTrendIcon(trend)}

          <span className="text-slate-600">
            {trendLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
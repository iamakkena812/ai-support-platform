/**
 * Trend card component.
 *
 * Displays a dashboard metric together with
 * a small trend chart.
 */

import type {
  ReactNode,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";

/**
 * Trend direction.
 */
export type TrendDirection =
  | "up"
  | "down"
  | "neutral";

/**
 * Trend data.
 */
export interface TrendPoint {
  /**
   * Trend value.
   */
  readonly value: number;
}

/**
 * Component properties.
 */
export interface TrendCardProps {
  /**
   * Card title.
   */
  readonly title: string;

  /**
   * Current value.
   */
  readonly value: string | number;

  /**
   * Trend values.
   */
  readonly data: readonly TrendPoint[];

  /**
   * Trend direction.
   */
  readonly trend?: TrendDirection;

  /**
   * Trend description.
   */
  readonly trendLabel?: string;

  /**
   * Optional icon.
   */
  readonly icon?: ReactNode;
}

/**
 * Returns trend icon.
 *
 * @param trend Trend direction.
 * @returns Trend icon.
 */
function getTrendIcon(
  trend: TrendDirection,
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
 * Trend card component.
 *
 * @param props Component properties.
 * @returns Trend card.
 */
export function TrendCard({
  title,
  value,
  data,
  trend = "neutral",
  trendLabel,
  icon,
}: TrendCardProps): React.JSX.Element {
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

      <div className="mt-6 h-20">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {trendLabel ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {getTrendIcon(trend)}

          <span className="text-slate-600">
            {trendLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
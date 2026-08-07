/**
 * Area chart component.
 *
 * Displays reusable area charts.
 */

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart data.
 */
export interface AreaChartData {
  /**
   * Label.
   */
  readonly label: string;

  /**
   * Value.
   */
  readonly value: number;
}

/**
 * Component properties.
 */
export interface AreaChartProps {
  /**
   * Chart title.
   */
  readonly title?: string;

  /**
   * Chart data.
   */
  readonly data: readonly AreaChartData[];
}

/**
 * Area chart component.
 *
 * @param props Component properties.
 * @returns Area chart component.
 */
export function AreaChart({
  title,
  data,
}: AreaChartProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>
      ) : null}

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <RechartsAreaChart
          data={data}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="label"
          />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            fill="#bfdbfe"
            strokeWidth={3}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
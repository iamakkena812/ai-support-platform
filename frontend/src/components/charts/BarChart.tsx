/**
 * Bar chart component.
 *
 * Displays reusable bar charts.
 */

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart data.
 */
export interface BarChartData {
  /**
   * Category label.
   */
  readonly label: string;

  /**
   * Numeric value.
   */
  readonly value: number;
}

/**
 * Component properties.
 */
export interface BarChartProps {
  /**
   * Chart title.
   */
  readonly title?: string;

  /**
   * Chart data.
   */
  readonly data: readonly BarChartData[];
}

/**
 * Bar chart component.
 *
 * @param props Component properties.
 * @returns Bar chart component.
 */
export function BarChart({
  title,
  data,
}: BarChartProps): React.JSX.Element {
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
        <RechartsBarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
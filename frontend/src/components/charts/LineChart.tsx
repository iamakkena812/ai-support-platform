/**
 * Line chart component.
 *
 * Displays reusable line charts.
 */

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart data.
 */
export interface LineChartData {
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
export interface LineChartProps {
  /**
   * Chart title.
   */
  readonly title?: string;

  /**
   * Chart data.
   */
  readonly data: readonly LineChartData[];
}

/**
 * Line chart.
 *
 * @param props Component properties.
 * @returns Line chart.
 */
export function LineChart({
  title,
  data,
}: LineChartProps): React.JSX.Element {
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
        <RechartsLineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
/**
 * Distribution chart component.
 *
 * Renders a record of label/count pairs (e.g. tickets grouped by
 * status or priority) as a bar chart.
 */

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface DistributionChartProps {
  /**
   * Chart title.
   */
  readonly title: string;

  /**
   * Distribution data, e.g. `{ open: 4, closed: 2 }`.
   */
  readonly data: Readonly<Record<string, number>>;
}

/**
 * Distribution chart.
 *
 * @param props - Component properties.
 * @returns Distribution chart component.
 */
export function DistributionChart({
  title,
  data,
}: DistributionChartProps): React.JSX.Element {
  const chartData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">{title}</h2>

      {chartData.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No data available for the selected range.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

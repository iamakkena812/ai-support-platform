/**
 * Dashboard charts component.
 *
 * Displays dashboard analytics charts.
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

import type {
  DashboardChartData,
} from "../types/dashboard.types";

export interface DashboardChartsProps {
  /**
   * Chart data.
   */
  readonly data: readonly DashboardChartData[];

  /**
   * Chart title.
   */
  readonly title?: string;
}

/**
 * Dashboard charts.
 */
export function DashboardCharts({
  data,
  title = "Dashboard Overview",
}: DashboardChartsProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
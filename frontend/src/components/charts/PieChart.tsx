/**
 * Pie chart component.
 *
 * Displays reusable pie charts.
 */

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * Chart data.
 */
export interface PieChartData {
  /**
   * Segment label.
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
export interface PieChartProps {
  /**
   * Chart title.
   */
  readonly title?: string;

  /**
   * Chart data.
   */
  readonly data: readonly PieChartData[];
}

/**
 * Chart colors.
 */
const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#64748b",
];

/**
 * Pie chart component.
 *
 * @param props Component properties.
 * @returns Pie chart component.
 */
export function PieChart({
  title,
  data,
}: PieChartProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>
      ) : null}

      <ResponsiveContainer
        width="100%"
        height={340}
      >
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            outerRadius={110}
            label
          >
            {data.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              ),
            )}
          </Pie>

          <Tooltip />

          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
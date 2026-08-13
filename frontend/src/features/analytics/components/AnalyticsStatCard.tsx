/**
 * Analytics statistic card.
 */

export interface AnalyticsStatCardProps {
  /**
   * Card title.
   */
  readonly title: string;

  /**
   * Statistic value.
   */
  readonly value: number | string;

  /**
   * Optional description.
   */
  readonly description?: string;
}

/**
 * Statistic card.
 *
 * @param props - Component properties.
 * @returns Statistic card component.
 */
export function AnalyticsStatCard({
  title,
  value,
  description,
}: AnalyticsStatCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>

      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

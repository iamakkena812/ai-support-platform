/**
 * AI insights card component.
 */

import type {
  AIInsight,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface AIInsightsCardProps {
  /**
   * AI-generated insights.
   */
  readonly insights: readonly AIInsight[];
}

/**
 * Returns badge classes for an insight severity.
 *
 * @param severity - Insight severity.
 * @returns Tailwind CSS classes.
 */
function getSeverityClasses(
  severity: AIInsight["severity"],
): string {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800";

    case "medium":
      return "bg-yellow-100 text-yellow-800";

    case "low":
    default:
      return "bg-green-100 text-green-800";
  }
}

/**
 * AI insights card.
 *
 * @param props - Component properties.
 * @returns AI insights component.
 */
export function AIInsightsCard({
  insights,
}: AIInsightsCardProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          AI Insights
        </h2>
      </div>

      {insights.length ===
      0 ? (
        <div className="p-8 text-center text-gray-500">
          No AI insights are
          available.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {insights.map(
            (
              insight,
            ) => (
              <div
                key={
                  insight.id
                }
                className="space-y-3 px-6 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {
                      insight.title
                    }
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityClasses(
                      insight.severity,
                    )}`}
                  >
                    {
                      insight.severity
                    }
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {
                    insight.description
                  }
                </p>

                <div className="text-xs text-gray-500">
                  Generated{" "}
                  {new Date(
                    insight.generatedAt,
                  ).toLocaleString()}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
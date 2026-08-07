/**
 * Project timeline component.
 *
 * Displays project milestones
 * and important events.
 */

import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

/**
 * Timeline item.
 */
export interface ProjectTimelineItem {
  /**
   * Timeline identifier.
   */
  readonly id: string;

  /**
   * Timeline title.
   */
  readonly title: string;

  /**
   * Timeline description.
   */
  readonly description?: string;

  /**
   * Timeline date.
   */
  readonly date: string | Date;

  /**
   * Indicates completion.
   */
  readonly completed: boolean;
}

/**
 * Component properties.
 */
export interface ProjectTimelineProps {
  /**
   * Timeline items.
   */
  readonly items: readonly ProjectTimelineItem[];
}

/**
 * Project timeline component.
 *
 * @param props Component properties.
 * @returns Project timeline.
 */
export function ProjectTimeline({
  items,
}: ProjectTimelineProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Calendar
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-slate-900">
          Project Timeline
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No timeline events available.
        </p>
      ) : (
        <div className="relative ml-3 border-l-2 border-slate-200">
          {items.map((item) => {
            const date =
              item.date instanceof Date
                ? item.date
                : new Date(item.date);

            return (
              <div
                key={item.id}
                className="relative mb-8 ml-6 last:mb-0"
              >
                <div className="absolute -left-[34px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  {item.completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-600"
                    />
                  ) : (
                    <Circle
                      size={18}
                      className="text-slate-400"
                    />
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={14} />

                      {date.toLocaleDateString()}
                    </div>
                  </div>

                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        item.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700",
                      ].join(" ")}
                    >
                      {item.completed
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
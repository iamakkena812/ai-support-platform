/**
 * Dashboard welcome component.
 *
 * Displays a personalized welcome message
 * for the authenticated user.
 */

import {
  CalendarDays,
  Sparkles,
} from "lucide-react";

/**
 * Component properties.
 */
export interface DashboardWelcomeProps {
  /**
   * User name.
   */
  readonly name: string;

  /**
   * Optional greeting.
   */
  readonly greeting?: string;
}

/**
 * Dashboard welcome.
 *
 * @param props Component properties.
 * @returns Dashboard welcome component.
 */
export function DashboardWelcome({
  name,
  greeting = "Welcome back",
}: DashboardWelcomeProps): React.JSX.Element {
  const today =
    new Intl.DateTimeFormat(
      undefined,
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ).format(
      new Date(),
    );

  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={22} />

            <h2 className="text-2xl font-bold">
              {greeting},{" "}
              {name}
            </h2>
          </div>

          <p className="mt-3 max-w-2xl text-blue-100">
            Here's an overview of your
            Enterprise AI Support Platform
            for today.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
          <CalendarDays
            size={20}
          />

          <span className="text-sm font-medium">
            {today}
          </span>
        </div>
      </div>
    </section>
  );
}
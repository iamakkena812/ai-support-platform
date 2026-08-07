/**
 * Empty state component.
 */

import { Inbox } from "lucide-react";

/**
 * Component properties.
 */
export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
}

/**
 * Empty state.
 */
export function EmptyState({
  title,
  description,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16">
      <Inbox className="mb-4 h-14 w-14 text-slate-300" />

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
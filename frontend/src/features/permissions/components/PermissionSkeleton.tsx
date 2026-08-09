/**
 * Permission skeleton.
 *
 * Displays loading placeholders for the Permissions feature.
 */

/**
 * Permission skeleton properties.
 */
export interface PermissionSkeletonProps {
  /**
   * Number of placeholder rows/cards.
   *
   * @default 5
   */
  readonly count?: number;
}

/**
 * Permission skeleton.
 *
 * @param props - Component properties.
 * @returns Permission loading skeleton.
 */
export function PermissionSkeleton({
  count = 5,
}: PermissionSkeletonProps) {
  const items = Array.from(
    { length: count },
    (_, index) => index,
  );

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white"
      role="status"
      aria-label="Loading permissions"
    >
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 px-6 py-4"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>

            <div className="hidden h-4 w-24 animate-pulse rounded bg-gray-100 sm:block" />
          </div>
        ))}
      </div>

      <span className="sr-only">
        Loading permissions...
      </span>
    </div>
  );
}
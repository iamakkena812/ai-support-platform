/**
 * Customer skeleton component.
 *
 * Displays placeholder content while
 * customer data is loading.
 */

import {
  DashboardGrid,
} from "../../dashboard/components";

import {
  Skeleton,
} from "../../../components/feedback";

/**
 * Customer skeleton component.
 *
 * @returns Customer skeleton component.
 */
export function CustomerSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton
          variant="title"
          width={320}
        />

        <Skeleton
          width={460}
        />
      </div>

      {/* Statistics */}
      <DashboardGrid>
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangle"
            height={140}
          />
        ))}
      </DashboardGrid>

      {/* Filters */}
      <Skeleton
        variant="rectangle"
        height={90}
      />

      {/* Customer table */}
      <Skeleton
        variant="rectangle"
        height={560}
      />
    </div>
  );
}
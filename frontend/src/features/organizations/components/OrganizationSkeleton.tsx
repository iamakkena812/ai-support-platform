/**
 * Organization skeleton component.
 *
 * Displays placeholder content while
 * organization data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";

import {
  DashboardGrid,
} from "../../dashboard/components";

/**
 * Organization skeleton.
 *
 * @returns Organization skeleton component.
 */
export function OrganizationSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton
          variant="title"
          width={320}
        />

        <Skeleton
          width={500}
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
        height={80}
      />

      {/* Table */}
      <Skeleton
        variant="rectangle"
        height={480}
      />
    </div>
  );
}
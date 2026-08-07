/**
 * User skeleton component.
 *
 * Displays placeholder content while
 * user data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";

import {
  DashboardGrid,
} from "../../dashboard/components";

/**
 * User skeleton.
 *
 * @returns User skeleton component.
 */
export function UserSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton
          variant="title"
          width={280}
        />

        <Skeleton
          width={420}
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

      {/* Users Table */}
      <Skeleton
        variant="rectangle"
        height={500}
      />
    </div>
  );
}
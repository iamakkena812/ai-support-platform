/**
 * Project skeleton component.
 *
 * Displays placeholder content while
 * project data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";

import {
  DashboardGrid,
} from "../../dashboard/components";

/**
 * Project skeleton component.
 *
 * @returns Project skeleton component.
 */
export function ProjectSkeleton(): React.JSX.Element {
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
        height={80}
      />

      {/* Project table */}
      <Skeleton
        variant="rectangle"
        height={560}
      />
    </div>
  );
}
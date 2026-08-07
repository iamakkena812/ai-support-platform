/**
 * Dashboard skeleton component.
 *
 * Displays placeholder content while the
 * dashboard data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";

import {
  DashboardGrid,
} from "./DashboardGrid";

/**
 * Dashboard skeleton.
 *
 * @returns Dashboard skeleton component.
 */
export function DashboardSkeleton(): React.JSX.Element {
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
          length: 4,
        }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangle"
            height={140}
          />
        ))}
      </DashboardGrid>

      {/* Charts */}
      <DashboardGrid columns={2}>
        <Skeleton
          variant="rectangle"
          height={360}
        />

        <Skeleton
          variant="rectangle"
          height={360}
        />
      </DashboardGrid>

      {/* Tables */}
      <DashboardGrid columns={2}>
        <Skeleton
          variant="rectangle"
          height={300}
        />

        <Skeleton
          variant="rectangle"
          height={300}
        />
      </DashboardGrid>
    </div>
  );
}
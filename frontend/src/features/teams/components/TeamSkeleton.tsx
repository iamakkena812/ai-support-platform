/**
 * Team skeleton component.
 *
 * Displays placeholder content while
 * team data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";

import {
  DashboardGrid,
} from "../../dashboard/components";


/**
 * Team skeleton component.
 *
 * @returns Team skeleton component.
 */
export function TeamSkeleton(): React.JSX.Element {

  return (

    <div
      className="space-y-6"
    >

      {/* Header */}

      <Skeleton
        width={420}
      />


      {/* Statistics */}

      <DashboardGrid>

        {
          Array.from({
            length: 5,
          }).map(
            (
              _,
              index,
            ) => (

              <Skeleton
                key={index}
                height={120}
              />

            ),
          )
        }

      </DashboardGrid>



      {/* Filters */}

      <div
        className="grid gap-4 md:grid-cols-3"
      >

        <Skeleton
          height={42}
        />

        <Skeleton
          height={42}
        />

        <Skeleton
          height={42}
        />

      </div>



      {/* Table */}

      <div
        className="space-y-3"
      >

        {
          Array.from({
            length: 6,
          }).map(
            (
              _,
              index,
            ) => (

              <Skeleton
                key={index}
                height={56}
              />

            ),
          )
        }

      </div>


    </div>

  );

}
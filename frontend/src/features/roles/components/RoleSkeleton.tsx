/**
 * Role skeleton component.
 *
 * Displays placeholder content while
 * role data is loading.
 */

import {
  Skeleton,
} from "../../../components/feedback";



/**
 * Role skeleton component.
 *
 * @returns Role skeleton component.
 */
export function RoleSkeleton(): React.JSX.Element {

  return (

    <div
      className="space-y-6"
    >


      {/* Header */}

      <div
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <Skeleton
          width={320}
          height={32}
        />


        <div
          className="mt-3"
        >

          <Skeleton
            width={520}
            height={18}
          />

        </div>

      </div>



      {/* Statistics */}

      <div

        className="grid gap-6 md:grid-cols-3 xl:grid-cols-6"

      >

        {
          Array.from(
            {
              length: 6,
            },
          ).map(
            (
              _,
              index,
            ) => (

              <div

                key={
                  index
                }

                className="rounded-lg border border-slate-200 bg-white p-6"

              >

                <Skeleton
                  width={120}
                  height={18}
                />


                <div
                  className="mt-3"
                >

                  <Skeleton
                    width={80}
                    height={32}
                  />

                </div>


              </div>

            ),
          )
        }


      </div>



      {/* Filters */}

      <div

        className="rounded-lg border border-slate-200 bg-white p-6"

      >

        <div
          className="grid gap-4 md:grid-cols-3"
        >

          {
            Array.from(
              {
                length: 3,
              },
            ).map(
              (
                _,
                index,
              ) => (

                <Skeleton

                  key={
                    index
                  }

                  width={220}

                  height={40}

                />

              ),
            )
          }

        </div>

      </div>



      {/* Table */}

      <div

        className="rounded-lg border border-slate-200 bg-white p-6"

      >

        {
          Array.from(
            {
              length: 8,
            },
          ).map(
            (
              _,
              index,
            ) => (

              <div

                key={
                  index
                }

                className="mb-4 flex items-center justify-between"

              >

                <Skeleton
                  width={240}
                  height={20}
                />


                <Skeleton
                  width={100}
                  height={20}
                />


              </div>

            ),
          )
        }


      </div>


    </div>

  );

}
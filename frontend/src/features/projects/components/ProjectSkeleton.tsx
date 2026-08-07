/**
 * Project skeleton component.
 *
 * Displays loading placeholders while
 * project data is being fetched.
 */


/**
 * Project skeleton.
 *
 * @returns Project skeleton component.
 */
export function ProjectSkeleton(): React.JSX.Element {

  return (

    <div
      className="space-y-6"
    >

      <div
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div
          className="h-6 w-48 animate-pulse rounded bg-slate-200"
        />


        <div
          className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200"
        />

      </div>


      <div
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div
          className="grid gap-4 md:grid-cols-2"
        >

          {
            Array.from(
              {
                length: 4,
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
                  className="h-20 animate-pulse rounded bg-slate-100"
                />

              ),
            )
          }

        </div>

      </div>


      <div
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div
          className="space-y-3"
        >

          {
            Array.from(
              {
                length: 5,
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
                  className="h-5 animate-pulse rounded bg-slate-100"
                />

              ),
            )
          }

        </div>

      </div>

    </div>

  );

}
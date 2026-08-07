/**
 * Project empty component.
 *
 * Displays an empty state when no projects
 * are available.
 */


/**
 * Project empty.
 *
 * @returns Project empty component.
 */
export function ProjectEmpty(): React.JSX.Element {

  return (

    <div
      className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm"
    >

      <h2
        className="text-lg font-semibold text-slate-900"
      >
        No Projects Found
      </h2>


      <p
        className="mt-2 text-sm text-slate-600"
      >
        There are no projects available matching your filters.
      </p>

    </div>

  );

}
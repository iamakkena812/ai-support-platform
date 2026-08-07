/**
 * Project filters component.
 *
 * Displays search and filter controls
 * for the projects list.
 */

import type {
  ProjectFilterValues,
} from "../types/project.types";


/**
 * Component properties.
 */
export interface ProjectFiltersProps {

  /**
   * Current filters.
   */
  readonly filters?: ProjectFilterValues;


  /**
   * Filter change callback.
   */
  readonly onChange: (
    filters: ProjectFilterValues,
  ) => void;

}


/**
 * Project filters.
 *
 * @param props Component properties.
 * @returns Project filters component.
 */
export function ProjectFilters(
  {
    filters = {},
    onChange,
  }: ProjectFiltersProps,
): React.JSX.Element {


  function updateFilter(
    key: keyof ProjectFilterValues,
    value: string,
  ): void {

    onChange(
      {
        ...filters,

        [key]:
          value.length > 0
            ? value
            : undefined,
      },
    );

  }


  return (

    <div
      className="rounded-lg border border-slate-200 bg-white p-4"
    >

      <div
        className="grid gap-4 md:grid-cols-3"
      >

        <div>

          <label
            className="block text-sm font-medium text-slate-700"
          >
            Search
          </label>


          <input
            type="text"
            value={
              filters.search ?? ""
            }
            onChange={
              (event) =>
                updateFilter(
                  "search",
                  event.target.value,
                )
            }
            placeholder="Search projects..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />

        </div>


        <div>

          <label
            className="block text-sm font-medium text-slate-700"
          >
            Status
          </label>


          <select
            value={
              filters.status ?? ""
            }
            onChange={
              (event) =>
                updateFilter(
                  "status",
                  event.target.value,
                )
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >

            <option value="">
              All Statuses
            </option>


            <option value="active">
              Active
            </option>


            <option value="inactive">
              Inactive
            </option>


            <option value="completed">
              Completed
            </option>


            <option value="archived">
              Archived
            </option>

          </select>

        </div>


        <div>

          <label
            className="block text-sm font-medium text-slate-700"
          >
            Priority
          </label>


          <select
            value={
              filters.priority ?? ""
            }
            onChange={
              (event) =>
                updateFilter(
                  "priority",
                  event.target.value,
                )
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >

            <option value="">
              All Priorities
            </option>


            <option value="low">
              Low
            </option>


            <option value="medium">
              Medium
            </option>


            <option value="high">
              High
            </option>


            <option value="critical">
              Critical
            </option>

          </select>

        </div>

      </div>

    </div>

  );

}
/**
 * User filters component.
 *
 * Displays search and filter controls
 * for the users list.
 */

import {
  Funnel,
  Search,
} from "lucide-react";

import type {
  UserFilterValues,
} from "../types/user.types";


/**
 * Component properties.
 */
export interface UserFiltersProps {

  /**
   * Current filters.
   */
  readonly filters?: UserFilterValues;


  /**
   * Filter change callback.
   */
  readonly onChange: (
    filters: UserFilterValues,
  ) => void;
}


/**
 * User filters.
 *
 * @param props Component properties.
 * @returns User filters component.
 */
export function UserFilters(
  {
    filters = {},
    onChange,
  }: UserFiltersProps,
): React.JSX.Element {

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >

      <div
        className="mb-4 flex items-center gap-2"
      >
        <Funnel
          className="h-5 w-5 text-slate-600"
        />

        <h2
          className="font-semibold text-slate-900"
        >
          Filters
        </h2>
      </div>


      <div
        className="grid gap-4 md:grid-cols-3"
      >

        <div
          className="relative"
        >
          <Search
            className="absolute left-3 top-3 h-4 w-4 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={
              filters.search ?? ""
            }
            onChange={
              (event) =>
                onChange(
                  {
                    ...filters,
                    search:
                      event.target.value,
                  },
                )
            }
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>


        <select
          value={
            filters.status ?? ""
          }
          onChange={
            (event) =>
              onChange(
                {
                  ...filters,
                  status:
                    event.target.value
                      ? event.target.value as UserFilterValues["status"]
                      : undefined,
                },
              )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
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

          <option value="suspended">
            Suspended
          </option>

        </select>


        <select
          value={
            filters.role ?? ""
          }
          onChange={
            (event) =>
              onChange(
                {
                  ...filters,
                  role:
                    event.target.value
                      ? event.target.value as UserFilterValues["role"]
                      : undefined,
                },
              )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >

          <option value="">
            All Roles
          </option>

          <option value="admin">
            Administrator
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="agent">
            Support Agent
          </option>

          <option value="customer">
            Customer
          </option>

        </select>

      </div>

    </section>
  );
}
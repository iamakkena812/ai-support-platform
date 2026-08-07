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

/**
 * Component properties.
 */
export interface UserFiltersProps {
  /**
   * Search value.
   */
  readonly search: string;

  /**
   * Status filter.
   */
  readonly status: string;

  /**
   * Role filter.
   */
  readonly role: string;

  /**
   * Search callback.
   */
  readonly onSearchChange: (
    value: string,
  ) => void;

  /**
   * Status callback.
   */
  readonly onStatusChange: (
    value: string,
  ) => void;

  /**
   * Role callback.
   */
  readonly onRoleChange: (
    value: string,
  ) => void;
}

/**
 * User filters.
 *
 * @param props Component properties.
 * @returns User filters component.
 */
export function UserFilters({
  search,
  status,
  role,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}: UserFiltersProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Funnel
          size={20}
          className="text-slate-600"
        />

        <h2 className="font-semibold text-slate-900">
          Filters
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value,
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">
            All Statuses
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="LOCKED">
            Locked
          </option>

          <option value="SUSPENDED">
            Suspended
          </option>
        </select>

        <select
          value={role}
          onChange={(event) =>
            onRoleChange(
              event.target.value,
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">
            All Roles
          </option>

          <option value="SUPER_ADMIN">
            Super Admin
          </option>

          <option value="ADMIN">
            Administrator
          </option>

          <option value="AGENT">
            Support Agent
          </option>

          <option value="USER">
            User
          </option>
        </select>
      </div>
    </section>
  );
}
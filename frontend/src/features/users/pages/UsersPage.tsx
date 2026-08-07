/**
 * Users page.
 *
 * Displays paginated users with filtering
 * and management actions.
 */

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  UserTable,
  UserFilters,
  UserEmpty,
  UserError,
  UserSkeleton,
} from "../components";

import {
  useUsers,
} from "../hooks/useUsers";

import type {
  UserFilterValues,
  UserListQuery,
} from "../types/user.types";


/**
 * Users page.
 *
 * @returns Users page component.
 */
export function UsersPage(): React.JSX.Element {

  const [
    query,
    setQuery,
  ] = useState<UserListQuery>({
    page: 1,
    pageSize: 10,
  });


  const {
    data,
    isLoading,
    isError,
    error,
  } = useUsers(
    query,
  );


  /**
   * Handles user filters.
   *
   * @param filters - User filters.
   */
  function handleFilters(
    filters: UserFilterValues,
  ): void {

    setQuery(
      {
        ...query,
        page: 1,
        filters,
      },
    );
  }


  if (isLoading) {
    return (
      <UserSkeleton />
    );
  }


  if (isError) {
    return (
      <UserError
        message={
          error instanceof Error
            ? error.message
            : "Failed to load users."
        }
      />
    );
  }


  if (
    !data ||
    data.items.length === 0
  ) {
    return (
      <UserEmpty />
    );
  }


  return (
    <div
      className="space-y-6"
    >

      <header
        className="flex items-center justify-between"
      >

        <div>

          <h1
            className="text-2xl font-bold text-slate-900"
          >
            Users
          </h1>

          <p
            className="mt-1 text-sm text-slate-600"
          >
            Manage platform users and access.
          </p>

        </div>


        <Link
          to="/users/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create User
        </Link>

      </header>


      <UserFilters
        onChange={
          handleFilters
        }
      />


      <UserTable
        users={
          data.items
        }
      />


      <div
        className="flex justify-between text-sm text-slate-600"
      >

        <span>
          Page {data.page} of {data.totalPages}
        </span>


        <span>
          Total Users: {data.total}
        </span>

      </div>

    </div>
  );
}
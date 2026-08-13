/**
 * Users page.
 *
 * Displays paginated users with filtering
 * and management actions.
 */

import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  UserTable,
  UserFilters,
  UserEmpty,
  UserError,
  UserSkeleton,
} from "../components";

import { useDeleteUser } from "../hooks/useUser";
import {
  useUsers,
} from "../hooks/useUsers";

import type {
  UserFilterValues,
} from "../types/user.types";


/**
 * Users page.
 *
 * @returns Users page component.
 */
export function UsersPage(): React.JSX.Element {

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<UserFilterValues>({});

  const {
    data,
    isLoading,
    isError,
    error,
  } = useUsers({ page, pageSize: 10 });

  const deleteUser = useDeleteUser();

  const filteredUsers = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.users.filter((user) => {
      const matchesSearch = filters.search
        ? user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.username.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesStatus =
        filters.isActive === undefined
          ? true
          : user.isActive === filters.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  async function handleDelete(id: string): Promise<void> {
    await deleteUser.mutateAsync(id);
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
    data.users.length === 0
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
        filters={filters}
        onChange={setFilters}
      />

      {deleteUser.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to delete user. Please try again.
        </div>
      )}

      <UserTable
        users={filteredUsers}
        onView={(id) => navigate(`/users/${id}`)}
        onEdit={(id) => navigate(`/users/${id}/edit`)}
        onDelete={(id) => {
          void handleDelete(id);
        }}
      />


      <div
        className="flex items-center justify-between text-sm text-slate-600"
      >

        <span>
          Total Users: {data.total}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {data.page} of {Math.max(data.totalPages, 1)}
          </span>

          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

    </div>
  );
}

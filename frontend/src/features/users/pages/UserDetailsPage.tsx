/**
 * User details page.
 *
 * Displays detailed information about a user.
 */

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  UserDetails,
  UserError,
  UserSkeleton,
} from "../components";

import {
  useDeleteUser,
  useUser,
} from "../hooks/useUser";


/**
 * User details page.
 *
 * @returns User details page component.
 */
export function UserDetailsPage(): React.JSX.Element {

  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();


  const {
    data: user,
    isLoading,
    isError,
    error,
  } =
    useUser(id);


  const {
    mutateAsync:
      deleteUser,
    isPending:
      isDeleting,
  } =
    useDeleteUser();


  /**
   * Deletes current user.
   */
  async function handleDelete(): Promise<void> {

    await deleteUser(
      id,
    );


    navigate(
      "/users",
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
            : "Failed to load user."
        }
      />
    );
  }


  if (!user) {
    return (
      <UserError
        message="User not found."
      />
    );
  }


  return (
    <div className="space-y-6">

      <header
        className="flex items-center justify-between"
      >

        <div>

          <h1
            className="text-2xl font-bold text-slate-900"
          >
            User Details
          </h1>


          <p
            className="mt-1 text-sm text-slate-600"
          >
            View user profile and access information.
          </p>

        </div>


        <div
          className="flex gap-3"
        >

          <Link
            to={`/users/${user.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit User
          </Link>


          <button
            type="button"
            disabled={
              isDeleting
            }
            onClick={
              handleDelete
            }
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {
              isDeleting
                ? "Deleting..."
                : "Delete User"
            }
          </button>

        </div>

      </header>


      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <UserDetails
          user={
            user
          }
        />

      </section>

    </div>
  );
}
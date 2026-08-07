/**
 * Role details page.
 *
 * Displays detailed information
 * about a role.
 */

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  RoleDetails,
  RoleError,
  RoleSkeleton,
  RoleSummary,
} from "../components";

import {
  useDeleteRole,
  useRole,
} from "../hooks/useRole";



/**
 * Role details page component.
 *
 * @returns Role details page.
 */
export function RoleDetailsPage(): React.JSX.Element {


  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();



  const {
    data: role,
    isLoading,
    isError,
    error,
  } =
    useRole(
      id,
    );



  const {
    mutateAsync:
      deleteRole,

    isPending:
      isDeleting,

  } =
    useDeleteRole();



  async function handleDelete(): Promise<void> {

    await deleteRole(
      id,
    );


    navigate(
      "/roles",
    );

  }



  if (isLoading) {

    return (
      <RoleSkeleton />
    );

  }



  if (isError) {

    return (

      <RoleError

        error={
          error
        }

      />

    );

  }



  if (!role) {

    return (

      <RoleError

        error={
          new Error(
            "Role not found.",
          )
        }

      />

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

            Role Details

          </h1>


          <p

            className="mt-1 text-sm text-slate-600"

          >

            View role information and permissions.

          </p>

        </div>



        <div

          className="flex gap-3"

        >

          <Link

            to={`/roles/${role.id}/edit`}

            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"

          >

            Edit Role

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
                : "Delete Role"
            }


          </button>


        </div>


      </header>



      <RoleSummary

        name={
          role.name
        }


        description={
          role.description ??
          undefined
        }


        status={
          role.status
        }


        isSystem={
          role.isSystem
        }


        permissionCount={
          role.permissions?.length ??
          0
        }


        userCount={
          role.users?.length ??
          0
        }


        createdAt={
          role.createdAt
        }

      />



      <section

        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

      >

        <RoleDetails

          name={
            role.name
          }


          description={
            role.description ??
            undefined
          }


          status={
            role.status
          }


          isSystem={
            role.isSystem
          }


          permissions={
            role.permissions ?? []
          }


          users={
            role.users ?? []
          }


          createdAt={
            role.createdAt
          }


          updatedAt={
            role.updatedAt
          }

        />

      </section>


    </div>

  );

}
/**
 * Edit team page.
 *
 * Provides team update functionality.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  TeamForm,
  TeamError,
  TeamSkeleton,
} from "../components";

import {
  useTeam,
  useUpdateTeam,
} from "../hooks/useTeam";

import type {
  UpdateTeamRequest,
} from "../types/team.types";

import type {
  TeamFormValues,
} from "../components/TeamForm";


/**
 * Edit team page.
 *
 * @returns Edit team page component.
 */
export function EditTeamPage(): React.JSX.Element {

  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();


  const {
    data: team,
    isLoading,
    isError,
    error,
  } =
    useTeam(
      id,
    );


  const {
    mutateAsync:
      updateTeam,

    isPending,

  } =
    useUpdateTeam();



  /**
   * Handles team update.
   *
   * @param values Team form values.
   */
  async function handleSubmit(
    values: TeamFormValues,
  ): Promise<void> {


    const payload: UpdateTeamRequest =
    {
      name:
        values.name,

      description:
        values.description || null,

      status:
        values.status as UpdateTeamRequest["status"],

    };


    await updateTeam(
      {
        id,
        payload,
      },
    );


    navigate(
      `/teams/${id}`,
    );

  }



  if (isLoading) {

    return (
      <TeamSkeleton />
    );

  }



  if (isError) {

    return (

      <TeamError
        error={
          error instanceof Error
            ? error
            : null
        }
      />

    );

  }



  if (!team) {

    return (

      <TeamError
        error={
          new Error(
            "Team not found.",
          )
        }
      />

    );

  }



  return (

    <div
      className="space-y-6"
    >

      <header>

        <h1
          className="text-2xl font-bold text-slate-900"
        >
          Edit Team
        </h1>


        <p
          className="mt-1 text-sm text-slate-600"
        >
          Update team information and settings.
        </p>


      </header>



      <section

        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

      >

        <TeamForm

          initialValues={
            {
              name:
                team.name,

              description:
                team.description
                  ?? "",

              organizationId:
                team.organization?.id
                  ?? "",

              status:
                team.status,

            }
          }


          organizations={[]}


          onSubmit={
            handleSubmit
          }


          isSubmitting={
            isPending
          }


          submitLabel="Update Team"

        />


      </section>


    </div>

  );

}
/**
 * Create team page.
 *
 * Provides team creation functionality.
 */

import {
  useNavigate,
} from "react-router-dom";

import {
  TeamForm,
} from "../components";

import {
  useCreateTeam,
} from "../hooks/useTeams";

import type {
  CreateTeamRequest,
} from "../types/team.types";

import type {
  TeamFormValues,
} from "../components/TeamForm";


/**
 * Create team page.
 *
 * @returns Create team page component.
 */
export function CreateTeamPage(): React.JSX.Element {

  const navigate =
    useNavigate();


  const {
    mutateAsync:
      createTeam,

    isPending,

  } =
    useCreateTeam();



  /**
   * Handles team creation.
   *
   * @param values Team form values.
   */
  async function handleSubmit(
    values: TeamFormValues,
  ): Promise<void> {

    const payload: CreateTeamRequest =
    {
      organizationId:
        values.organizationId,

      name:
        values.name,

      description:
        values.description || null,

      status:
        values.status as CreateTeamRequest["status"],

    };


    const team =
      await createTeam(
        payload,
      );


    navigate(
      `/teams/${team.id}`,
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
          Create Team
        </h1>


        <p
          className="mt-1 text-sm text-slate-600"
        >
          Create a new team for users and projects.
        </p>

      </header>



      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <TeamForm

          organizations={[]}

          onSubmit={
            handleSubmit
          }

          isSubmitting={
            isPending
          }

          submitLabel="Create Team"

        />

      </section>

    </div>

  );

}
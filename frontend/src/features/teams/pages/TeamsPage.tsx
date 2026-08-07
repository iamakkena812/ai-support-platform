/**
 * Teams page.
 *
 * Displays paginated teams with filtering
 * and management actions.
 */

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  TeamEmpty,
  TeamError,
  TeamFilters,
  TeamHeader,
  TeamSkeleton,
  TeamTable,
} from "../components";

import {
  useTeams,
} from "../hooks/useTeams";

import type {
  TeamFilterValues,
  TeamListQuery,
} from "../types/team.types";


/**
 * Teams page.
 *
 * @returns Teams page component.
 */
export function TeamsPage(): React.JSX.Element {

  const navigate =
    useNavigate();


  const [
    query,
    setQuery,
  ] =
    useState<TeamListQuery>(
      {
        page: 1,
        pageSize: 10,
      },
    );


  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } =
    useTeams(
      query,
    );


  const [
    filters,
    setFilters,
  ] =
    useState<TeamFilterValues>(
      {},
    );


  function handleFilters(
    values: TeamFilterValues,
  ): void {

    setFilters(
      values,
    );


    setQuery(
      {
        ...query,
        page: 1,
        filters: values,
      },
    );

  }


  function handleView(
    id: string,
  ): void {

    navigate(
      `/teams/${id}`,
    );

  }


  function handleCreate(): void {

    navigate(
      "/teams/create",
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
        onRetry={
          () =>
            void refetch()
        }
      />

    );

  }



  if (
    !data ||
    data.items.length === 0
  ) {

    return (

      <div
        className="space-y-6"
      >

        <TeamHeader
          actions={

            <button
              type="button"
              onClick={
                handleCreate
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Team
            </button>

          }
        />

        <TeamEmpty
          onAction={
            handleCreate
          }
        />

      </div>

    );

  }



  return (

    <div
      className="space-y-6"
    >

      <TeamHeader
        actions={

          <button
            type="button"
            onClick={
              handleCreate
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Team
          </button>

        }
      />



      <TeamFilters

        search={
          filters.search ?? ""
        }

        organizationId={
          filters.organizationId ?? ""
        }

        status={
          filters.status ?? ""
        }

        organizations={[]}

        onSearchChange={
          (value) =>
            handleFilters(
              {
                ...filters,
                search: value,
              },
            )
        }

        onOrganizationChange={
          (value) =>
            handleFilters(
              {
                ...filters,
                organizationId: value,
              },
            )
        }

        onStatusChange={
          (value) =>
            handleFilters(
              {
                ...filters,
                status:
                  value as TeamFilterValues["status"],
              },
            )
        }

      />



      <TeamTable

        teams={
          data.items.map(
            (team) => (

              {
                id: team.id,
                name: team.name,
                organization:
                  team.organization?.name
                    ?? "-",
                memberCount:
                  team.members.length,
                projectCount:
                  team.projects.length,
                status:
                  team.status,
              }

            ),
          )
        }

        onView={
          handleView
        }

      />



      <div
        className="flex justify-between text-sm text-slate-600"
      >

        <span>
          Page {data.page} of {data.totalPages}
        </span>


        <span>
          Total Teams: {data.total}
        </span>

      </div>


    </div>

  );

}
/**
 * React Query hooks for team collection operations.
 *
 * Provides hooks for retrieving,
 * creating teams and managing cache.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  TeamService,
} from "../services/team.service";

import type {
  Team,
  CreateTeamRequest,
  TeamListQuery,
} from "../types/team.types";


/**
 * Team query keys.
 */
export const teamQueryKeys = {

  /**
   * Base team key.
   */
  all: [
    "teams",
  ] as const,


  /**
   * Team list key.
   *
   * @param query Team query.
   */
  list: (
    query?: TeamListQuery,
  ) =>
    [
      ...teamQueryKeys.all,
      "list",
      query,
    ] as const,


  /**
   * Team detail key.
   *
   * @param id Team identifier.
   */
  detail: (
    id: string,
  ) =>
    [
      ...teamQueryKeys.all,
      "detail",
      id,
    ] as const,


  /**
   * Statistics key.
   */
  statistics: [
    ...["teams"],
    "statistics",
  ] as const,

};



/**
 * Retrieves teams.
 *
 * @param query Team filters.
 * @returns Team query result.
 */
export function useTeams(
  query?: TeamListQuery,
) {

  return useQuery({

    queryKey:
      teamQueryKeys.list(
        query,
      ),


    queryFn:
      () =>
        TeamService.getTeams(
          query,
        ),

  });

}



/**
 * Creates team.
 *
 * @returns Team mutation.
 */
export function useCreateTeam() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Team,
    Error,
    CreateTeamRequest
  >({

    mutationFn:
      async (
        payload,
      ) => {

        return TeamService.createTeam(
          payload,
        );

      },


    onSuccess:
      async () => {

        await queryClient.invalidateQueries(
          {
            queryKey:
              teamQueryKeys.all,
          },
        );

      },

  });

}
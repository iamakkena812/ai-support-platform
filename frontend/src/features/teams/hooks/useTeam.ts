/**
 * React Query hooks for single team operations.
 *
 * Provides hooks for retrieving,
 * updating and deleting a team by identifier.
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
  UpdateTeamRequest,
} from "../types/team.types";

import {
  teamQueryKeys,
} from "./useTeams";


/**
 * Update team variables.
 */
export interface UpdateTeamVariables {

  /**
   * Team identifier.
   */
  readonly id: string;


  /**
   * Update payload.
   */
  readonly payload: UpdateTeamRequest;

}


/**
 * Retrieves team by identifier.
 *
 * @param id Team identifier.
 * @returns Team query result.
 */
export function useTeam(
  id: string,
) {

  return useQuery({

    queryKey:
      teamQueryKeys.detail(
        id,
      ),


    queryFn:
      () =>
        TeamService.getTeam(
          id,
        ),


    enabled:
      Boolean(id),

  });

}



/**
 * Updates existing team.
 *
 * @returns Team mutation.
 */
export function useUpdateTeam() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Team,
    Error,
    UpdateTeamVariables
  >({

    mutationFn:
      async (
        {
          id,
          payload,
        },
      ) => {

        return TeamService.updateTeam(
          id,
          payload,
        );

      },


    onSuccess:
      async (
        _data,
        variables,
      ) => {

        await Promise.all([

          queryClient.invalidateQueries(
            {
              queryKey:
                teamQueryKeys.all,
            },
          ),


          queryClient.invalidateQueries(
            {
              queryKey:
                teamQueryKeys.detail(
                  variables.id,
                ),
            },
          ),

        ]);

      },

  });

}



/**
 * Deletes existing team.
 *
 * @returns Team mutation.
 */
export function useDeleteTeam() {

  const queryClient =
    useQueryClient();


  return useMutation<
    void,
    Error,
    string
  >({

    mutationFn:
      async (
        id,
      ) => {

        await TeamService.deleteTeam(
          id,
        );

      },


    onSuccess:
      async (
        _data,
        id,
      ) => {

        await Promise.all([

          queryClient.invalidateQueries(
            {
              queryKey:
                teamQueryKeys.all,
            },
          ),


          queryClient.removeQueries(
            {
              queryKey:
                teamQueryKeys.detail(
                  id,
                ),
            },
          ),

        ]);

      },

  });

}
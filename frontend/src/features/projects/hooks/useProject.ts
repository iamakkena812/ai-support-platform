/**
 * React Query hooks for single project operations.
 *
 * Provides hooks for retrieving,
 * updating projects and statistics.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ProjectService,
} from "../services/project.service";

import type {
  Project,
  UpdateProjectRequest,
} from "../types/project.types";

import {
  projectQueryKeys,
} from "./useProjects";


/**
 * Update project variables.
 */
export interface UpdateProjectVariables {

  /**
   * Project identifier.
   */
  readonly id: string;


  /**
   * Update payload.
   */
  readonly payload: UpdateProjectRequest;
}


/**
 * Retrieves project by identifier.
 *
 * @param id Project identifier.
 * @returns Project query result.
 */
export function useProject(
  id: string,
) {

  return useQuery({

    queryKey:
      projectQueryKeys.detail(
        id,
      ),


    queryFn:
      () =>
        ProjectService.getProject(
          id,
        ),


    enabled:
      Boolean(id),

  });

}


/**
 * Updates existing project.
 *
 * @returns Project mutation.
 */
export function useUpdateProject() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Project,
    Error,
    UpdateProjectVariables
  >({

    mutationFn:
      async (
        {
          id,
          payload,
        },
      ) => {

        return ProjectService.updateProject(
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
                projectQueryKeys.all,
            },
          ),


          queryClient.invalidateQueries(
            {
              queryKey:
                projectQueryKeys.detail(
                  variables.id,
                ),
            },
          ),

        ]);

      },

  });

}


/**
 * Retrieves project statistics.
 *
 * @returns Statistics query.
 */
export function useProjectStatistics() {

  return useQuery({

    queryKey:
      projectQueryKeys.statistics,


    queryFn:
      () =>
        ProjectService.getProjectStatistics(),

  });

}

/**
 * Deletes existing project.
 *
 * @returns Project delete mutation.
 */
export function useDeleteProject() {

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

        await ProjectService.deleteProject(
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
                projectQueryKeys.all,
            },
          ),


          queryClient.removeQueries(
            {
              queryKey:
                projectQueryKeys.detail(
                  id,
                ),
            },
          ),

        ]);

      },

  });

}
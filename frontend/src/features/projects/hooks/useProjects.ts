/**
 * React Query hooks for project collection operations.
 *
 * Provides hooks for listing, creating,
 * and deleting projects.
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
  CreateProjectRequest,
  Project,
  ProjectListQuery,
} from "../types/project.types";


/**
 * Project query keys.
 */
export const projectQueryKeys = {

  /**
   * Base project key.
   */
  all: [
    "projects",
  ] as const,


  /**
   * Project list key.
   *
   * @param query Project query.
   */
  list: (
    query?: ProjectListQuery,
  ) =>
    [
      "projects",
      "list",
      query,
    ] as const,


  /**
   * Project detail key.
   *
   * @param id Project identifier.
   */
  detail: (
    id: string,
  ) =>
    [
      "projects",
      "detail",
      id,
    ] as const,


  /**
   * Project statistics key.
   */
  statistics: [
    "projects",
    "statistics",
  ] as const,

};


/**
 * Retrieves projects.
 *
 * @param query Project query.
 * @returns Project list query.
 */
export function useProjects(
  query?: ProjectListQuery,
) {

  return useQuery({

    queryKey:
      projectQueryKeys.list(
        query,
      ),


    queryFn:
      () =>
        ProjectService.getProjects(
          query,
        ),


    staleTime:
      5 * 60 * 1000,


    gcTime:
      10 * 60 * 1000,


    retry:
      2,


    refetchOnWindowFocus:
      false,

  });

}


/**
 * Creates project mutation.
 */
export function useCreateProject() {

  const queryClient =
    useQueryClient();


  return useMutation<
    Project,
    Error,
    CreateProjectRequest
  >({

    mutationFn:
      (
        payload,
      ) =>
        ProjectService.createProject(
          payload,
        ),


    onSuccess:
      async () => {

        await queryClient.invalidateQueries(
          {
            queryKey:
              projectQueryKeys.all,
          },
        );

      },

  });

}


/**
 * Delete project mutation.
 */

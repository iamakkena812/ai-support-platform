/**
 * Hook for retrieving projects.
 */

import {
  useQuery,
} from "@tanstack/react-query";

import { ProjectService } from "../services/project.service";

/**
 * Project query keys.
 */
export const projectQueryKeys = {
  /**
   * Root key.
   */
  all: ["projects"] as const,

  /**
   * List key.
   */
  lists: () =>
    [
      ...projectQueryKeys.all,
      "list",
    ] as const,

  /**
   * List key with pagination.
   */
  list: (
    page: number,
    size: number,
  ) =>
    [
      ...projectQueryKeys.lists(),
      page,
      size,
    ] as const,

  /**
   * Detail key.
   */
  details: () =>
    [
      ...projectQueryKeys.all,
      "detail",
    ] as const,

  /**
   * Project detail key.
   */
  detail: (
    projectId: string,
  ) =>
    [
      ...projectQueryKeys.details(),
      projectId,
    ] as const,
};

/**
 * Retrieves a paginated list of projects.
 *
 * @param page Current page.
 * @param size Page size.
 * @returns Query result.
 */
export function useProjects(
  page = 1,
  size = 10,
) {
  return useQuery({
    queryKey:
      projectQueryKeys.list(
        page,
        size,
      ),

    queryFn: () =>
      ProjectService.getProjects(
        page,
        size,
      ),

    staleTime:
      1000 * 60 * 5,
  });
}
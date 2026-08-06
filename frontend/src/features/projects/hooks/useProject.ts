/**
 * Hook for retrieving a single project.
 */

import { useQuery } from "@tanstack/react-query";

import { ProjectService } from "../services/project.service";
import { projectQueryKeys } from "./useProjects";

/**
 * Retrieves a project by identifier.
 *
 * @param projectId Project identifier.
 * @returns Query result.
 */
export function useProject(
  projectId: string,
) {
  return useQuery({
    queryKey:
      projectQueryKeys.detail(
        projectId,
      ),

    queryFn: () =>
      ProjectService.getProject(
        projectId,
      ),

    enabled:
      projectId.trim().length > 0,

    staleTime:
      1000 * 60 * 5,
  });
}
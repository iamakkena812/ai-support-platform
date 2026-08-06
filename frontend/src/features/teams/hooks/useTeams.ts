/**
 * Teams hook.
 *
 * React Query hook for team list.
 */

import { useQuery } from "@tanstack/react-query";

import { TeamService } from "../services/team.service";

import type {
  TeamListResponse,
} from "../types/team.types";

/**
 * Team query keys.
 */
export const teamQueryKeys = {
  all: ["teams"] as const,

  lists: () =>
    [...teamQueryKeys.all, "list"] as const,

  list: (
    page: number,
    size: number,
  ) =>
    [
      ...teamQueryKeys.lists(),
      page,
      size,
    ] as const,
};

/**
 * Teams hook.
 */
export function useTeams(
  page = 1,
  size = 10,
) {
  return useQuery<TeamListResponse>({
    queryKey: teamQueryKeys.list(
      page,
      size,
    ),

    queryFn: () =>
      TeamService.getTeams(
        page,
        size,
      ),

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
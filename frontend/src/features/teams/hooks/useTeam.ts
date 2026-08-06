/**
 * Team hook.
 *
 * React Query hook for a single team.
 */

import { useQuery } from "@tanstack/react-query";

import { TeamService } from "../services/team.service";

import type {
  TeamResponse,
} from "../types/team.types";

/**
 * Team query keys.
 */
export const teamQueryKeys = {
  all: ["teams"] as const,

  detail: (
    teamId: string,
  ) =>
    [...teamQueryKeys.all, teamId] as const,
};

/**
 * Team hook.
 */
export function useTeam(
  teamId: string,
) {
  return useQuery<TeamResponse>({
    queryKey: teamQueryKeys.detail(
      teamId,
    ),

    queryFn: () =>
      TeamService.getTeam(
        teamId,
      ),

    enabled: teamId.length > 0,

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}
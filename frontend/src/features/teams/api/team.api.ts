/**
 * Team API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateTeamRequest,
  TeamListResponse,
  TeamResponse,
  UpdateTeamRequest,
} from "../types/team.types";

/**
 * Team API.
 */
export class TeamApi {
  /**
   * List teams.
   */
  public static async getTeams(
    page = 1,
    size = 10,
  ): Promise<TeamListResponse> {
    const response =
      await apiClient.get<TeamListResponse>(
        "/teams",
        {
          params: {
            page,
            size,
          },
        },
      );

    return response.data;
  }

  /**
   * Get team by identifier.
   */
  public static async getTeam(
    teamId: string,
  ): Promise<TeamResponse> {
    const response =
      await apiClient.get<TeamResponse>(
        `/teams/${teamId}`,
      );

    return response.data;
  }

  /**
   * Create team.
   */
  public static async createTeam(
    payload: CreateTeamRequest,
  ): Promise<TeamResponse> {
    const response =
      await apiClient.post<TeamResponse>(
        "/teams",
        payload,
      );

    return response.data;
  }

  /**
   * Update team.
   */
  public static async updateTeam(
    teamId: string,
    payload: UpdateTeamRequest,
  ): Promise<TeamResponse> {
    const response =
      await apiClient.put<TeamResponse>(
        `/teams/${teamId}`,
        payload,
      );

    return response.data;
  }

  /**
   * Delete team.
   */
  public static async deleteTeam(
    teamId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/teams/${teamId}`,
    );
  }
}
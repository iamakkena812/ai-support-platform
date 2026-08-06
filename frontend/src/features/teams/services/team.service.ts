/**
 * Team service.
 *
 * Contains business logic for team operations.
 */

import { TeamApi } from "../api/team.api";

import {
  teamListResponseSchema,
  teamResponseSchema,
} from "../schemas/team.schema";

import type {
  CreateTeamRequest,
  TeamListResponse,
  TeamResponse,
  UpdateTeamRequest,
} from "../types/team.types";

/**
 * Team service.
 */
export class TeamService {
  /**
   * List teams.
   */
  public static async getTeams(
    page = 1,
    size = 10,
  ): Promise<TeamListResponse> {
    const response =
      await TeamApi.getTeams(
        page,
        size,
      );

    return teamListResponseSchema.parse(
      response,
    );
  }

  /**
   * Get team.
   */
  public static async getTeam(
    teamId: string,
  ): Promise<TeamResponse> {
    const response =
      await TeamApi.getTeam(
        teamId,
      );

    return teamResponseSchema.parse(
      response,
    );
  }

  /**
   * Create team.
   */
  public static async createTeam(
    payload: CreateTeamRequest,
  ): Promise<TeamResponse> {
    const response =
      await TeamApi.createTeam(
        payload,
      );

    return teamResponseSchema.parse(
      response,
    );
  }

  /**
   * Update team.
   */
  public static async updateTeam(
    teamId: string,
    payload: UpdateTeamRequest,
  ): Promise<TeamResponse> {
    const response =
      await TeamApi.updateTeam(
        teamId,
        payload,
      );

    return teamResponseSchema.parse(
      response,
    );
  }

  /**
   * Delete team.
   */
  public static async deleteTeam(
    teamId: string,
  ): Promise<void> {
    await TeamApi.deleteTeam(
      teamId,
    );
  }
}
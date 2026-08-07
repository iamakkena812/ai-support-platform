/**
 * Team API endpoints.
 *
 * Provides HTTP endpoint definitions
 * for team operations.
 */

import {
  apiClient,
} from "../../../api/axios/client";

import type {
  CreateTeamRequest,
  Team,
  TeamListQuery,
  TeamListResponse,
  TeamStatistics,
  UpdateTeamRequest,
} from "../types/team.types";


/**
 * Team API.
 */
export const TeamApi = {


  /**
   * Retrieves teams.
   *
   * @param query Team list query.
   * @returns Paginated teams.
   */
  async getTeams(
    query?: TeamListQuery,
  ): Promise<TeamListResponse> {

    const response =
      await apiClient.get<TeamListResponse>(
        "/teams",
        {
          params:
            query,
        },
      );


    return response.data;

  },



  /**
   * Retrieves a team by identifier.
   *
   * @param id Team identifier.
   * @returns Team.
   */
  async getTeam(
    id: string,
  ): Promise<Team> {

    const response =
      await apiClient.get<Team>(
        `/teams/${id}`,
      );


    return response.data;

  },



  /**
   * Creates a team.
   *
   * @param payload Team creation payload.
   * @returns Created team.
   */
  async createTeam(
    payload: CreateTeamRequest,
  ): Promise<Team> {

    const response =
      await apiClient.post<Team>(
        "/teams",
        payload,
      );


    return response.data;

  },



  /**
   * Updates a team.
   *
   * @param id Team identifier.
   * @param payload Update payload.
   * @returns Updated team.
   */
  async updateTeam(
    id: string,
    payload: UpdateTeamRequest,
  ): Promise<Team> {

    const response =
      await apiClient.patch<Team>(
        `/teams/${id}`,
        payload,
      );


    return response.data;

  },



  /**
   * Deletes a team.
   *
   * @param id Team identifier.
   */
  async deleteTeam(
    id: string,
  ): Promise<void> {

    await apiClient.delete(
      `/teams/${id}`,
    );

  },



  /**
   * Retrieves team statistics.
   *
   * @returns Team statistics.
   */
  async getTeamStatistics(): Promise<TeamStatistics> {

    const response =
      await apiClient.get<TeamStatistics>(
        "/teams/statistics",
      );


    return response.data;

  },


};
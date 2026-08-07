/**
 * Team service.
 *
 * Provides API operations for teams.
 */

import {
  apiClient,
}  from "../../../api/axios/client";

import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamListQuery,
  TeamListResponse,
  TeamStatistics,
} from "../types/team.types";


/**
 * Team service.
 */
export const TeamService = {


  /**
   * Retrieves teams.
   *
   * @param query Team query filters.
   * @returns Paginated teams.
   */
  async getTeams(
    query?: TeamListQuery,
  ): Promise<TeamListResponse> {

    const response =
      await apiClient.get<TeamListResponse>(
        "/teams",
        {
          params: query,
        },
      );


    return response.data;

  },



  /**
   * Retrieves team by identifier.
   *
   * @param id Team identifier.
   * @returns Team entity.
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
   * Creates team.
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
   * Updates team.
   *
   * @param id Team identifier.
   * @param payload Team update payload.
   * @returns Updated team.
   */
  async updateTeam(
    id: string,
    payload: UpdateTeamRequest,
  ): Promise<Team> {

    const response =
      await apiClient.put<Team>(
        `/teams/${id}`,
        payload,
      );


    return response.data;

  },



  /**
   * Deletes team.
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
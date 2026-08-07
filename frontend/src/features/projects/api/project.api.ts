/**
 * Project API client.
 *
 * Handles HTTP communication for project operations.
 */

import {
  apiClient,
} from "../../../api/axios/client";


import type {
  CreateProjectRequest,
  ProjectListQuery,
  UpdateProjectRequest,
} from "../types/project.types";


/**
 * Project API.
 */
export class ProjectApi {


  /**
   * Retrieves projects.
   *
   * @param query Project list query.
   * @returns Project response.
   */
  public static async getProjects(
    query?: ProjectListQuery,
  ): Promise<unknown> {

    const response =
      await apiClient.get(
        "/projects",
        {
          params: query,
        },
      );


    return response.data;
  }


  /**
   * Retrieves single project.
   *
   * @param projectId Project identifier.
   * @returns Project response.
   */
  public static async getProject(
    projectId: string,
  ): Promise<unknown> {

    const response =
      await apiClient.get(
        `/projects/${projectId}`,
      );


    return response.data;
  }


  /**
   * Creates project.
   *
   * @param payload Project payload.
   * @returns Created project.
   */
  public static async createProject(
    payload: CreateProjectRequest,
  ): Promise<unknown> {

    const response =
      await apiClient.post(
        "/projects",
        payload,
      );


    return response.data;
  }


  /**
   * Updates project.
   *
   * @param projectId Project identifier.
   * @param payload Project update payload.
   * @returns Updated project.
   */
  public static async updateProject(
    projectId: string,
    payload: UpdateProjectRequest,
  ): Promise<unknown> {

    const response =
      await apiClient.put(
        `/projects/${projectId}`,
        payload,
      );


    return response.data;
  }


  /**
   * Deletes project.
   *
   * @param projectId Project identifier.
   */
  public static async deleteProject(
    projectId: string,
  ): Promise<void> {

    await apiClient.delete(
      `/projects/${projectId}`,
    );
  }


  /**
   * Retrieves project statistics.
   *
   * @returns Project statistics.
   */
  public static async getProjectStatistics(): Promise<unknown> {

    const response =
      await apiClient.get(
        "/projects/statistics",
      );


    return response.data;
  }

}
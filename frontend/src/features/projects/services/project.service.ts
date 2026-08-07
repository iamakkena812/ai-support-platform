/**
 * Project service.
 *
 * Contains business logic for project operations.
 */

import {
  ProjectApi,
} from "../api/project.api";

import {
  projectListResponseSchema,
  projectResponseSchema,
  projectStatisticsSchema,
} from "../schemas/project.schema";

import type {
  CreateProjectRequest,
  ProjectListQuery,
  ProjectListResponse,
  ProjectStatistics,
  UpdateProjectRequest,
  Project,
} from "../types/project.types";


/**
 * Project service.
 */
export class ProjectService {


  /**
   * Retrieves projects.
   *
   * @param query Project list query.
   * @returns Project list response.
   */
  public static async getProjects(
    query?: ProjectListQuery,
  ): Promise<ProjectListResponse> {

    const response =
      await ProjectApi.getProjects(
        query,
      );


    return projectListResponseSchema.parse(
      response,
    );
  }


  /**
   * Retrieves single project.
   *
   * @param projectId Project identifier.
   * @returns Project entity.
   */
  public static async getProject(
    projectId: string,
  ): Promise<Project> {

    const response =
      await ProjectApi.getProject(
        projectId,
      );


    return projectResponseSchema.parse(
      response,
    );
  }


  /**
   * Creates project.
   *
   * @param payload Project creation payload.
   * @returns Created project.
   */
  public static async createProject(
    payload: CreateProjectRequest,
  ): Promise<Project> {

    const response =
      await ProjectApi.createProject(
        payload,
      );


    return projectResponseSchema.parse(
      response,
    );
  }


  /**
   * Updates project.
   *
   * @param projectId Project identifier.
   * @param payload Update payload.
   * @returns Updated project.
   */
  public static async updateProject(
    projectId: string,
    payload: UpdateProjectRequest,
  ): Promise<Project> {

    const response =
      await ProjectApi.updateProject(
        projectId,
        payload,
      );


    return projectResponseSchema.parse(
      response,
    );
  }


  /**
   * Deletes project.
   *
   * @param projectId Project identifier.
   */
  public static async deleteProject(
    projectId: string,
  ): Promise<void> {

    await ProjectApi.deleteProject(
      projectId,
    );
  }


  /**
   * Retrieves project statistics.
   *
   * @returns Project statistics.
   */
  public static async getProjectStatistics(): Promise<ProjectStatistics> {

    const response =
      await ProjectApi.getProjectStatistics();


    return projectStatisticsSchema.parse(
      response,
    );
  }

}
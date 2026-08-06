/**
 * Project service.
 *
 * Contains business logic for project operations.
 */

import { ProjectApi } from "../api/project.api";

import {
  projectListResponseSchema,
  projectResponseSchema,
} from "../schemas/project.schema";

import type {
  ProjectListResponseSchema,
  ProjectResponseSchema,
} from "../schemas/project.schema";

import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";
/**
 * Project service.
 */
export class ProjectService {
  /**
   * List projects.
   */
  public static async getProjects(
    page = 1,
    size = 10,
  ): Promise<ProjectListResponseSchema> {
    const response =
      await ProjectApi.getProjects(
        page,
        size,
      );

    return projectListResponseSchema.parse(
      response,
    );
  }

  /**
   * Get project.
   */
  public static async getProject(
    projectId: string,
  ): Promise<ProjectResponseSchema> {
    const response =
      await ProjectApi.getProject(
        projectId,
      );

    return projectResponseSchema.parse(
      response,
    );
  }

  /**
   * Create project.
   */
  public static async createProject(
    payload: CreateProjectRequest,
  ): Promise<ProjectResponseSchema> {
    const response =
      await ProjectApi.createProject(
        payload,
      );

    return projectResponseSchema.parse(
      response,
    );
  }

  /**
   * Update project.
   */
  public static async updateProject(
    projectId: string,
    payload: UpdateProjectRequest,
  ): Promise<ProjectResponseSchema> {
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
   * Delete project.
   */
  public static async deleteProject(
    projectId: string,
  ): Promise<void> {
    await ProjectApi.deleteProject(
      projectId,
    );
  }
}
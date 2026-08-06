/**
 * Project API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateProjectRequest,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "../types/project.types";

/**
 * Project API.
 */
export class ProjectApi {
  /**
   * List projects.
   */
  public static async getProjects(
    page = 1,
    size = 10,
  ): Promise<ProjectListResponse> {
    const response =
      await apiClient.get<ProjectListResponse>(
        "/projects",
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
   * Get project by identifier.
   */
  public static async getProject(
    projectId: string,
  ): Promise<ProjectResponse> {
    const response =
      await apiClient.get<ProjectResponse>(
        `/projects/${projectId}`,
      );

    return response.data;
  }

  /**
   * Create project.
   */
  public static async createProject(
    payload: CreateProjectRequest,
  ): Promise<ProjectResponse> {
    const response =
      await apiClient.post<ProjectResponse>(
        "/projects",
        payload,
      );

    return response.data;
  }

  /**
   * Update project.
   */
  public static async updateProject(
    projectId: string,
    payload: UpdateProjectRequest,
  ): Promise<ProjectResponse> {
    const response =
      await apiClient.put<ProjectResponse>(
        `/projects/${projectId}`,
        payload,
      );

    return response.data;
  }

  /**
   * Delete project.
   */
  public static async deleteProject(
    projectId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/projects/${projectId}`,
    );
  }
}
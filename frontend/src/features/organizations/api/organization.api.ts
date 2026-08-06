/**
 * Organization API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateOrganizationRequest,
  OrganizationListResponse,
  OrganizationResponse,
  UpdateOrganizationRequest,
} from "../types/organization.types";

/**
 * Organization API.
 */
export class OrganizationApi {
  /**
   * List organizations.
   */
  public static async getOrganizations(
    page = 1,
    size = 10,
  ): Promise<OrganizationListResponse> {
    const response =
      await apiClient.get<OrganizationListResponse>(
        "/organizations",
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
   * Get organization by id.
   */
  public static async getOrganization(
    organizationId: string,
  ): Promise<OrganizationResponse> {
    const response =
      await apiClient.get<OrganizationResponse>(
        `/organizations/${organizationId}`,
      );

    return response.data;
  }

  /**
   * Create organization.
   */
  public static async createOrganization(
    payload: CreateOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const response =
      await apiClient.post<OrganizationResponse>(
        "/organizations",
        payload,
      );

    return response.data;
  }

  /**
   * Update organization.
   */
  public static async updateOrganization(
    organizationId: string,
    payload: UpdateOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const response =
      await apiClient.put<OrganizationResponse>(
        `/organizations/${organizationId}`,
        payload,
      );

    return response.data;
  }

  /**
   * Delete organization.
   */
  public static async deleteOrganization(
    organizationId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/organizations/${organizationId}`,
    );
  }
}
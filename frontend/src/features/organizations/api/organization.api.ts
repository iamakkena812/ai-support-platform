/**
 * Organization API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListResponse,
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
    pageSize = 10,
  ): Promise<OrganizationListResponse> {
    const response =
      await apiClient.get<OrganizationListResponse>(
        "/organizations",
        {
          params: {
            page,
            pageSize,
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
  ): Promise<Organization> {
    const response =
      await apiClient.get<Organization>(
        `/organizations/${organizationId}`,
      );

    return response.data;
  }

  /**
   * Create organization.
   */
  public static async createOrganization(
    payload: CreateOrganizationRequest,
  ): Promise<Organization> {
    const response =
      await apiClient.post<Organization>(
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
  ): Promise<Organization> {
    const response =
      await apiClient.patch<Organization>(
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

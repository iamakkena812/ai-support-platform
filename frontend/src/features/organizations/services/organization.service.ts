/**
 * Organization service.
 *
 * Contains business logic for organization operations.
 */

import { OrganizationApi } from "../api/organization.api";

import {
  organizationListResponseSchema,
  organizationSchema,
} from "../schemas/organization.schema";

import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListResponse,
  UpdateOrganizationRequest,
} from "../types/organization.types";

/**
 * Organization service.
 */
export class OrganizationService {
  /**
   * List organizations.
   */
  public static async getOrganizations(
    page = 1,
    pageSize = 10,
  ): Promise<OrganizationListResponse> {
    const response =
      await OrganizationApi.getOrganizations(
        page,
        pageSize,
      );

    return organizationListResponseSchema.parse(
      response,
    );
  }

  /**
   * Get organization.
   */
  public static async getOrganization(
    organizationId: string,
  ): Promise<Organization> {
    const response =
      await OrganizationApi.getOrganization(
        organizationId,
      );

    return organizationSchema.parse(
      response,
    );
  }

  /**
   * Create organization.
   */
  public static async createOrganization(
    payload: CreateOrganizationRequest,
  ): Promise<Organization> {
    const response =
      await OrganizationApi.createOrganization(
        payload,
      );

    return organizationSchema.parse(
      response,
    );
  }

  /**
   * Update organization.
   */
  public static async updateOrganization(
    organizationId: string,
    payload: UpdateOrganizationRequest,
  ): Promise<Organization> {
    const response =
      await OrganizationApi.updateOrganization(
        organizationId,
        payload,
      );

    return organizationSchema.parse(
      response,
    );
  }

  /**
   * Delete organization.
   */
  public static async deleteOrganization(
    organizationId: string,
  ): Promise<void> {
    await OrganizationApi.deleteOrganization(
      organizationId,
    );
  }
}

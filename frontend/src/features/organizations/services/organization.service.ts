/**
 * Organization service.
 *
 * Contains business logic for organization operations.
 */

import { OrganizationApi } from "../api/organization.api";

import {
  organizationListResponseSchema,
  organizationResponseSchema,
} from "../schemas/organization.schema";

import type {
  CreateOrganizationRequest,
  OrganizationListResponse,
  OrganizationResponse,
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
    size = 10,
  ): Promise<OrganizationListResponse> {
    const response =
      await OrganizationApi.getOrganizations(
        page,
        size,
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
  ): Promise<OrganizationResponse> {
    const response =
      await OrganizationApi.getOrganization(
        organizationId,
      );

    return organizationResponseSchema.parse(
      response,
    );
  }

  /**
   * Create organization.
   */
  public static async createOrganization(
    payload: CreateOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const response =
      await OrganizationApi.createOrganization(
        payload,
      );

    return organizationResponseSchema.parse(
      response,
    );
  }

  /**
   * Update organization.
   */
  public static async updateOrganization(
    organizationId: string,
    payload: UpdateOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const response =
      await OrganizationApi.updateOrganization(
        organizationId,
        payload,
      );

    return organizationResponseSchema.parse(
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
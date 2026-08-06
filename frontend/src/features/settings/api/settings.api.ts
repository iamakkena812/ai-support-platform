/**
 * Settings API.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  SettingsResponse,
  UpdateSettingsRequest,
} from "../types/settings.types";

/**
 * Settings API client.
 */
export const settingsApi = {
  /**
   * Returns application settings.
   *
   * @returns Settings response.
   */
  async getSettings(): Promise<SettingsResponse> {
    const response =
      await apiClient.get<SettingsResponse>(
        "/settings",
      );

    return response.data;
  },

  /**
   * Updates application settings.
   *
   * @param request - Update request.
   * @returns Updated settings.
   */
  async updateSettings(
    request: UpdateSettingsRequest,
  ): Promise<SettingsResponse> {
    const response =
      await apiClient.put<SettingsResponse>(
        "/settings",
        request,
      );

    return response.data;
  },

  /**
   * Resets settings to their default values.
   */
  async resetSettings(): Promise<void> {
    await apiClient.post(
      "/settings/reset",
    );
  },

  /**
   * Tests the configured AI provider.
   *
   * @returns Indicates whether the connection succeeded.
   */
  async testAIConnection(): Promise<{
    readonly success: boolean;
    readonly message: string;
  }> {
    const response =
      await apiClient.post<{
        readonly success: boolean;
        readonly message: string;
      }>(
        "/settings/ai/test",
      );

    return response.data;
  },
};
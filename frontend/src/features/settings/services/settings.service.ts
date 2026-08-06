/**
 * Settings service.
 */

import { settingsApi } from "../api/settings.api";

import type {
  SettingsResponse,
  UpdateSettingsRequest,
} from "../types/settings.types";

/**
 * Settings service.
 *
 * Encapsulates business operations for
 * application settings.
 */
export const settingsService = {
  /**
   * Returns application settings.
   *
   * @returns Settings response.
   */
  getSettings(): Promise<SettingsResponse> {
    return settingsApi.getSettings();
  },

  /**
   * Updates application settings.
   *
   * @param request - Update request.
   * @returns Updated settings.
   */
  updateSettings(
    request: UpdateSettingsRequest,
  ): Promise<SettingsResponse> {
    return settingsApi.updateSettings(
      request,
    );
  },

  /**
   * Resets all settings to defaults.
   */
  resetSettings(): Promise<void> {
    return settingsApi.resetSettings();
  },

  /**
   * Tests the configured AI provider connection.
   *
   * @returns Connection test result.
   */
  testAIConnection(): Promise<{
    readonly success: boolean;
    readonly message: string;
  }> {
    return settingsApi.testAIConnection();
  },
};
/**
 * Settings React Query hooks.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { settingsService } from "../services/settings.service";

import type {
  SettingsResponse,
  UpdateSettingsRequest,
} from "../types/settings.types";

/**
 * Settings query keys.
 */
export const settingsKeys = {
  /**
   * Root query key.
   */
  all: [
    "settings",
  ] as const,

  /**
   * Settings query.
   */
  settings: () =>
    [
      ...settingsKeys.all,
      "configuration",
    ] as const,
};

/**
 * Returns application settings.
 *
 * @returns React Query result.
 */
export function useSettings() {
  return useQuery<
    SettingsResponse,
    Error
  >({
    queryKey:
      settingsKeys.settings(),

    queryFn: () =>
      settingsService.getSettings(),
  });
}

/**
 * Updates application settings.
 *
 * @returns React Query mutation.
 */
export function useUpdateSettings() {
  const queryClient =
    useQueryClient();

  return useMutation<
    SettingsResponse,
    Error,
    UpdateSettingsRequest
  >({
    mutationFn: (
      request,
    ) =>
      settingsService.updateSettings(
        request,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            settingsKeys.settings(),
        },
      );
    },
  });
}

/**
 * Resets settings.
 *
 * @returns React Query mutation.
 */
export function useResetSettings() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    void
  >({
    mutationFn: () =>
      settingsService.resetSettings(),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            settingsKeys.settings(),
        },
      );
    },
  });
}

/**
 * Tests AI provider connectivity.
 *
 * @returns React Query mutation.
 */
export function useTestAIConnection() {
  return useMutation<
    {
      readonly success: boolean;
      readonly message: string;
    },
    Error,
    void
  >({
    mutationFn: () =>
      settingsService.testAIConnection(),
  });
}
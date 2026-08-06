/**
 * Settings page.
 */

import {
  useEffect,
  useState,
} from "react";

import { AISettings } from "../components/AISettings";
import { APIKeySettings } from "../components/APIKeySettings";
import { NotificationSettings } from "../components/NotificationSettings";
import { OrganizationSettings } from "../components/OrganizationSettings";
import { ProfileSettings } from "../components/ProfileSettings";
import { SecuritySettings } from "../components/SecuritySettings";
import { ThemeSettings } from "../components/ThemeSettings";
import {
  useResetSettings,
  useSettings,
  useTestAIConnection,
  useUpdateSettings,
} from "../hooks/useSettings";

import type {
  SettingsResponse,
  UpdateSettingsRequest,
} from "../types/settings.types";

/**
 * Settings page.
 *
 * @returns Settings page component.
 */
export function SettingsPage(): React.JSX.Element {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useSettings();

  const updateMutation =
    useUpdateSettings();

  const resetMutation =
    useResetSettings();

  const testMutation =
    useTestAIConnection();

  const [
    settings,
    setSettings,
  ] = useState<
    SettingsResponse | null
  >(null);

  useEffect(() => {
    if (data) {
      setSettings(
        data,
      );
    }
  }, [data]);

  /**
   * Saves settings.
   */
  const handleSave =
    async (): Promise<void> => {
      if (
        settings == null
      ) {
        return;
      }

      const request: UpdateSettingsRequest =
        {
          profile:
            settings.profile,
          organization:
            settings.organization,
          notifications:
            settings.notifications,
          security:
            settings.security,
          ai:
            settings.ai,
          theme:
            settings.theme,
          apiKeys:
            settings.apiKeys,
        };

      try {
        const response =
          await updateMutation.mutateAsync(
            request,
          );

        setSettings(
          response,
        );
      } catch (
        saveError
      ) {
        console.error(
          "Failed to save settings.",
          saveError,
        );
      }
    };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading settings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load settings."}
      </div>
    );
  }

  if (
    settings == null
  ) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Settings not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your application
            configuration.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              void resetMutation.mutateAsync();
            }}
            disabled={
              resetMutation.isPending
            }
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={
              updateMutation.isPending
            }
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </header>

      <ProfileSettings
        profile={
          settings.profile
        }
        onChange={(
          profile,
        ) =>
          setSettings({
            ...settings,
            profile,
          })
        }
      />

      <OrganizationSettings
        organization={
          settings.organization
        }
        onChange={(
          organization,
        ) =>
          setSettings({
            ...settings,
            organization,
          })
        }
      />

      <NotificationSettings
        notifications={
          settings.notifications
        }
        onChange={(
          notifications,
        ) =>
          setSettings({
            ...settings,
            notifications,
          })
        }
      />

      <SecuritySettings
        security={
          settings.security
        }
        onChange={(
          security,
        ) =>
          setSettings({
            ...settings,
            security,
          })
        }
      />

      <AISettings
        settings={
          settings.ai
        }
        onChange={(
          ai,
        ) =>
          setSettings({
            ...settings,
            ai,
          })
        }
        onTestConnection={() => {
          void testMutation.mutateAsync();
        }}
      />

      <ThemeSettings
        settings={
          settings.theme
        }
        onChange={(
          theme,
        ) =>
          setSettings({
            ...settings,
            theme,
          })
        }
      />

      <APIKeySettings
        apiKeys={
          settings.apiKeys
        }
        onChange={(
          apiKeys,
        ) =>
          setSettings({
            ...settings,
            apiKeys,
          })
        }
      />
    </div>
  );
}
/**
 * Settings page.
 *
 * Composes real, existing capabilities rather than a fictional
 * unified "settings" resource: profile via the Users module,
 * organization via the Organizations module (superusers only, matching
 * the backend's `CurrentSuperuserDependency`), and theme via the
 * application's real theme provider. Sections with no backend support
 * (notifications preferences, security policy, AI configuration, API
 * keys) are shown as honestly unavailable instead of being wired to
 * endpoints that do not exist.
 */

import { useEffect, useState } from "react";

import { AISettings } from "../components/AISettings";
import { APIKeySettings } from "../components/APIKeySettings";
import { NotificationSettings } from "../components/NotificationSettings";
import { OrganizationSettings } from "../components/OrganizationSettings";
import { ProfileSettings } from "../components/ProfileSettings";
import { SecuritySettings } from "../components/SecuritySettings";
import { ThemeSettings } from "../components/ThemeSettings";

import type { ProfileFormValues } from "../components/ProfileSettings";

import { useAuth } from "../../../app/providers/auth/useAuth";
import { useTheme } from "../../../app/providers/theme/useTheme";
import { useOrganization } from "../../organizations/hooks/useOrganization";
import { useUpdateOrganization } from "../../organizations/hooks/useOrganizations";
import { useUpdateUser } from "../../users/hooks/useUser";

import type { UpdateOrganizationRequest } from "../../organizations/types/organization.types";

/**
 * Settings page.
 *
 * @returns Settings page component.
 */
export function SettingsPage(): React.JSX.Element {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { theme, setTheme } = useTheme();

  const isSuperuser = user?.isSuperuser ?? false;

  const {
    data: organization,
    isLoading: isOrganizationLoading,
    isError: isOrganizationError,
    error: organizationError,
  } = useOrganization(isSuperuser ? (user?.organizationId ?? "") : "");

  const updateUserMutation = useUpdateUser();
  const updateOrganizationMutation = useUpdateOrganization();

  const [profileValues, setProfileValues] = useState<ProfileFormValues>({
    fullName: "",
    email: "",
    username: "",
  });

  const [organizationValues, setOrganizationValues] =
    useState<UpdateOrganizationRequest>({});

  useEffect(() => {
    if (user) {
      setProfileValues({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  useEffect(() => {
    if (organization) {
      setOrganizationValues({
        name: organization.name,
        code: organization.code,
        email: organization.email,
        phone: organization.phone,
        website: organization.website,
        timezone: organization.timezone,
      });
    }
  }, [organization]);

  /**
   * Saves profile and (if applicable) organization changes.
   */
  const handleSave = async (): Promise<void> => {
    if (user == null) {
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        payload: profileValues,
      });

      if (isSuperuser && organization) {
        await updateOrganizationMutation.mutateAsync({
          id: organization.id,
          payload: organizationValues,
        });
      }
    } catch (saveError) {
      console.error("Failed to save settings.", saveError);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading settings...
      </div>
    );
  }

  if (user == null) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Settings not found.
      </div>
    );
  }

  const isSaving =
    updateUserMutation.isPending || updateOrganizationMutation.isPending;

  const saveError = updateUserMutation.error ?? updateOrganizationMutation.error;

  const isSaved =
    updateUserMutation.isSuccess &&
    (!isSuperuser || updateOrganizationMutation.isSuccess || !organization);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

          <p className="mt-2 text-gray-600">
            Manage your profile{isSuperuser ? " and organization" : ""}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved ? (
            <span className="text-sm text-green-700">Saved.</span>
          ) : null}

          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={isSaving}
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {saveError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {saveError instanceof Error
            ? saveError.message
            : "Failed to save settings."}
        </div>
      ) : null}

      <ProfileSettings
        profile={user}
        values={profileValues}
        disabled={isSaving}
        onChange={setProfileValues}
      />

      {isSuperuser ? (
        isOrganizationLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
            Loading organization...
          </div>
        ) : isOrganizationError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {organizationError instanceof Error
              ? organizationError.message
              : "Failed to load organization."}
          </div>
        ) : (
          <OrganizationSettings
            values={organizationValues}
            disabled={isSaving}
            onChange={setOrganizationValues}
          />
        )
      ) : null}

      <ThemeSettings theme={theme} onChange={setTheme} />

      <NotificationSettings />
      <SecuritySettings />
      <AISettings />
      <APIKeySettings />
    </div>
  );
}

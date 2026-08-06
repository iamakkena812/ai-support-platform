/**
 * Settings feature exports.
 */

export * from "./api/settings.api";

export * from "./components/AISettings";
export * from "./components/APIKeySettings";
export * from "./components/NotificationSettings";
export * from "./components/OrganizationSettings";
export * from "./components/ProfileSettings";
export * from "./components/SecuritySettings";
export * from "./components/ThemeSettings";

export * from "./hooks/useSettings";

export * from "./pages/SettingsPage";

export {
  aiProviderSchema,
  profileSettingsSchema,
  organizationSettingsSchema,
  notificationSettingsSchema,
  securitySettingsSchema,
  aiSettingsSchema,
  themeModeSchema,
  themeSettingsSchema,
  apiKeySettingsSchema,
  updateSettingsSchema,
} from "./schemas/settings.schema";

export type {
  AISettingsValues,
  APIKeySettingsValues,
  NotificationSettingsValues,
  OrganizationSettingsValues,
  ProfileSettingsValues,
  SecuritySettingsValues,
  ThemeSettingsValues,
  UpdateSettingsValues,
} from "./schemas/settings.schema";

export * from "./services/settings.service";

export type {
  AIProvider,
  AISettings,
  APIKeySettings,
  NotificationSettings,
  OrganizationSettings,
  ProfileSettings,
  SecuritySettings,
  SettingsResponse,
  ThemeMode,
  ThemeSettings,
  UpdateSettingsRequest,
} from "./types/settings.types";

export * from "./utils";
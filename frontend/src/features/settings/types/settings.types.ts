/**
 * Settings domain types.
 *
 * Defines the TypeScript models used throughout the
 * Settings feature.
 */

/**
 * Theme mode.
 */
export type ThemeMode =
  | "light"
  | "dark"
  | "system";

/**
 * AI provider.
 */
export type AIProvider =
  | "openai"
  | "azure-openai"
  | "anthropic"
  | "google";

/**
 * User profile settings.
 */
export interface ProfileSettings {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * Full name.
   */
  readonly fullName: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Job title.
   */
  readonly jobTitle?: string | null;

  /**
   * Phone number.
   */
  readonly phoneNumber?: string | null;

  /**
   * Avatar URL.
   */
  readonly avatarUrl?: string | null;
}

/**
 * Organization settings.
 */
export interface OrganizationSettings {
  /**
   * Organization identifier.
   */
  readonly id: string;

  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization domain.
   */
  readonly domain?: string | null;

  /**
   * Support email.
   */
  readonly supportEmail?: string | null;

  /**
   * Time zone.
   */
  readonly timeZone: string;

  /**
   * Default language.
   */
  readonly language: string;
}

/**
 * Notification settings.
 */
export interface NotificationSettings {
  /**
   * Email notifications.
   */
  readonly emailEnabled: boolean;

  /**
   * Browser notifications.
   */
  readonly browserEnabled: boolean;

  /**
   * AI notifications.
   */
  readonly aiEnabled: boolean;

  /**
   * Ticket notifications.
   */
  readonly ticketEnabled: boolean;
}

/**
 * Security settings.
 */
export interface SecuritySettings {
  /**
   * Multi-factor authentication.
   */
  readonly mfaEnabled: boolean;

  /**
   * Session timeout (minutes).
   */
  readonly sessionTimeout: number;

  /**
   * Password expiry (days).
   */
  readonly passwordExpiryDays: number;
}

/**
 * AI settings.
 */
export interface AISettings {
  /**
   * AI enabled.
   */
  readonly enabled: boolean;

  /**
   * AI provider.
   */
  readonly provider: AIProvider;

  /**
   * Model name.
   */
  readonly model: string;

  /**
   * Temperature.
   */
  readonly temperature: number;
}

/**
 * Theme settings.
 */
export interface ThemeSettings {
  /**
   * Theme mode.
   */
  readonly mode: ThemeMode;
}

/**
 * API key settings.
 */
export interface APIKeySettings {
  /**
   * OpenAI API key.
   */
  readonly openAIKey?: string | null;

  /**
   * Azure OpenAI key.
   */
  readonly azureOpenAIKey?: string | null;

  /**
   * Anthropic API key.
   */
  readonly anthropicKey?: string | null;

  /**
   * Google AI API key.
   */
  readonly googleAIKey?: string | null;
}

/**
 * Settings response.
 */
export interface SettingsResponse {
  /**
   * Profile settings.
   */
  readonly profile: ProfileSettings;

  /**
   * Organization settings.
   */
  readonly organization: OrganizationSettings;

  /**
   * Notification settings.
   */
  readonly notifications: NotificationSettings;

  /**
   * Security settings.
   */
  readonly security: SecuritySettings;

  /**
   * AI settings.
   */
  readonly ai: AISettings;

  /**
   * Theme settings.
   */
  readonly theme: ThemeSettings;

  /**
   * API key settings.
   */
  readonly apiKeys: APIKeySettings;
}

/**
 * Update settings request.
 */
export interface UpdateSettingsRequest {
  /**
   * Profile settings.
   */
  readonly profile?: Partial<ProfileSettings>;

  /**
   * Organization settings.
   */
  readonly organization?: Partial<OrganizationSettings>;

  /**
   * Notification settings.
   */
  readonly notifications?: Partial<NotificationSettings>;

  /**
   * Security settings.
   */
  readonly security?: Partial<SecuritySettings>;

  /**
   * AI settings.
   */
  readonly ai?: Partial<AISettings>;

  /**
   * Theme settings.
   */
  readonly theme?: Partial<ThemeSettings>;

  /**
   * API key settings.
   */
  readonly apiKeys?: Partial<APIKeySettings>;
}
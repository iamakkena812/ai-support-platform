/**
 * Settings utility functions.
 */

import type {
  AIProvider,
  ThemeMode,
} from "../types/settings.types";

/**
 * Returns a display label for a theme mode.
 *
 * @param mode - Theme mode.
 * @returns Theme label.
 */
export function formatThemeMode(
  mode: ThemeMode,
): string {
  switch (mode) {
    case "light":
      return "Light";

    case "dark":
      return "Dark";

    case "system":
      return "System";

    default:
      return mode;
  }
}

/**
 * Returns a display label for an AI provider.
 *
 * @param provider - AI provider.
 * @returns Provider label.
 */
export function formatAIProvider(
  provider: AIProvider,
): string {
  switch (provider) {
    case "openai":
      return "OpenAI";

    case "azure-openai":
      return "Azure OpenAI";

    case "anthropic":
      return "Anthropic";

    case "google":
      return "Google AI";

    default:
      return provider;
  }
}

/**
 * Masks a secret value.
 *
 * @param value - Secret value.
 * @returns Masked value.
 */
export function maskSecret(
  value?: string | null,
): string {
  if (
    value == null ||
    value.length === 0
  ) {
    return "";
  }

  if (
    value.length <= 8
  ) {
    return "••••••••";
  }

  return `${value.slice(
    0,
    4,
  )}${"•".repeat(
    value.length - 8,
  )}${value.slice(-4)}`;
}

/**
 * Formats a session timeout.
 *
 * @param minutes - Timeout in minutes.
 * @returns Formatted timeout.
 */
export function formatSessionTimeout(
  minutes: number,
): string {
  if (
    minutes < 60
  ) {
    return `${minutes} minutes`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  const remainingMinutes =
    minutes % 60;

  if (
    remainingMinutes === 0
  ) {
    return `${hours} hour${
      hours === 1
        ? ""
        : "s"
    }`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Clamps the AI temperature.
 *
 * @param value - Temperature.
 * @returns Clamped value.
 */
export function clampTemperature(
  value: number,
): number {
  return Math.min(
    2,
    Math.max(
      0,
      value,
    ),
  );
}
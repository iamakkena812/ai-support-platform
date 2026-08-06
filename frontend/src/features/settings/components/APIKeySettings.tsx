/**
 * API key settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  APIKeySettings as APIKeySettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface APIKeySettingsProps {
  /**
   * API key settings.
   */
  readonly apiKeys: APIKeySettingsModel;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when API keys change.
   *
   * @param apiKeys - Updated API keys.
   */
  readonly onChange: (
    apiKeys: APIKeySettingsModel,
  ) => void;
}

/**
 * API key settings.
 *
 * @param props - Component properties.
 * @returns API key settings component.
 */
export function APIKeySettings({
  apiKeys,
  disabled = false,
  onChange,
}: APIKeySettingsProps): React.JSX.Element {
  /**
   * Updates an API key field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof APIKeySettingsModel,
  >(
    field: K,
    value: APIKeySettingsModel[K],
  ): void => {
    onChange({
      ...apiKeys,
      [field]: value,
    });
  };

  /**
   * Creates a change handler.
   *
   * @param field - Field name.
   * @returns Change handler.
   */
  const createChangeHandler =
    (
      field: keyof APIKeySettingsModel,
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      updateField(
        field,
        event.target.value,
      );
    };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        API Key Settings
      </h2>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>

          <input
            type="password"
            value={
              apiKeys.openAIKey ??
              ""
            }
            onChange={createChangeHandler(
              "openAIKey",
            )}
            disabled={
              disabled
            }
            autoComplete="off"
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Azure OpenAI API Key
          </label>

          <input
            type="password"
            value={
              apiKeys.azureOpenAIKey ??
              ""
            }
            onChange={createChangeHandler(
              "azureOpenAIKey",
            )}
            disabled={
              disabled
            }
            autoComplete="off"
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Anthropic API Key
          </label>

          <input
            type="password"
            value={
              apiKeys.anthropicKey ??
              ""
            }
            onChange={createChangeHandler(
              "anthropicKey",
            )}
            disabled={
              disabled
            }
            autoComplete="off"
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Google AI API Key
          </label>

          <input
            type="password"
            value={
              apiKeys.googleAIKey ??
              ""
            }
            onChange={createChangeHandler(
              "googleAIKey",
            )}
            disabled={
              disabled
            }
            autoComplete="off"
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
      </div>
    </section>
  );
}
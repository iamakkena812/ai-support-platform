/**
 * AI settings component.
 */

import type {
  ChangeEvent,
} from "react";

import type {
  AIProvider,
  AISettings as AISettingsModel,
} from "../types/settings.types";

/**
 * Component properties.
 */
export interface AISettingsProps {
  /**
   * AI settings.
   */
  readonly settings: AISettingsModel;

  /**
   * Indicates whether editing is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when settings change.
   *
   * @param settings - Updated settings.
   */
  readonly onChange: (
    settings: AISettingsModel,
  ) => void;

  /**
   * Invoked when the AI connection test is requested.
   */
  readonly onTestConnection?: () => void;
}

/**
 * AI settings.
 *
 * @param props - Component properties.
 * @returns AI settings component.
 */
export function AISettings({
  settings,
  disabled = false,
  onChange,
  onTestConnection,
}: AISettingsProps): React.JSX.Element {
  /**
   * Updates a field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof AISettingsModel,
  >(
    field: K,
    value: AISettingsModel[K],
  ): void => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        AI Settings
      </h2>

      <div className="space-y-6">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">
            Enable AI Features
          </span>

          <input
            type="checkbox"
            checked={
              settings.enabled
            }
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) =>
              updateField(
                "enabled",
                event.target.checked,
              )
            }
            disabled={
              disabled
            }
            className="h-5 w-5"
          />
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            AI Provider
          </label>

          <select
            value={
              settings.provider
            }
            onChange={(
              event: ChangeEvent<HTMLSelectElement>,
            ) =>
              updateField(
                "provider",
                event.target
                  .value as AIProvider,
              )
            }
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          >
            <option value="openai">
              OpenAI
            </option>

            <option value="azure-openai">
              Azure OpenAI
            </option>

            <option value="anthropic">
              Anthropic
            </option>

            <option value="google">
              Google AI
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Model
          </label>

          <input
            type="text"
            value={
              settings.model
            }
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) =>
              updateField(
                "model",
                event.target.value,
              )
            }
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Temperature
          </label>

          <input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={
              settings.temperature
            }
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) =>
              updateField(
                "temperature",
                Number(
                  event.target.value,
                ),
              )
            }
            disabled={
              disabled
            }
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={
              onTestConnection
            }
            disabled={
              disabled
            }
            className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Test Connection
          </button>
        </div>
      </div>
    </section>
  );
}
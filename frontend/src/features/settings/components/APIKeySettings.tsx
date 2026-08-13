/**
 * API key settings section.
 *
 * Provider API keys (OpenAI, Azure OpenAI, Anthropic, Google) are
 * configured server-side via environment variables
 * (backend/app/config/settings.py) and are deliberately not
 * user-editable through a web form -- there is no endpoint for this,
 * and inventing one would mean accepting raw secrets from the
 * browser. This is honestly shown as unavailable.
 */

import { UnavailableNotice } from "./UnavailableNotice";

/**
 * API key settings.
 *
 * @returns API key settings component.
 */
export function APIKeySettings(): React.JSX.Element {
  return (
    <UnavailableNotice
      title="API Key Settings"
      reason="AI provider API keys are configured server-side via environment variables and are not editable from the application."
    />
  );
}

/**
 * AI settings section.
 *
 * There is no persisted, organization-level AI configuration resource
 * (enabled/provider/model/temperature) or connection-test endpoint
 * anywhere in the backend -- the AI Chat module lets a user choose a
 * provider/model per-conversation instead (app/ai/chat). This is
 * honestly shown as unavailable rather than wired to a nonexistent
 * endpoint.
 */

import { UnavailableNotice } from "./UnavailableNotice";

/**
 * AI settings.
 *
 * @returns AI settings component.
 */
export function AISettings(): React.JSX.Element {
  return (
    <UnavailableNotice
      title="AI Settings"
      reason="A global AI configuration is not supported by the current backend -- the AI provider and model are chosen per-conversation in AI Chat instead."
    />
  );
}

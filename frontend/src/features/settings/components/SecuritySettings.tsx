/**
 * Security settings section.
 *
 * There is no MFA, configurable session timeout, or password expiry
 * policy anywhere in the current authentication architecture
 * (app/auth), so this is honestly shown as unavailable rather than
 * wired to a nonexistent endpoint.
 */

import { UnavailableNotice } from "./UnavailableNotice";

/**
 * Security settings.
 *
 * @returns Security settings component.
 */
export function SecuritySettings(): React.JSX.Element {
  return (
    <UnavailableNotice
      title="Security Settings"
      reason="Multi-factor authentication, session timeout, and password expiry policies are not supported by the current backend."
    />
  );
}

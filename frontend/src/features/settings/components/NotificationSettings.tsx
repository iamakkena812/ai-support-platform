/**
 * Notification settings section.
 *
 * The backend's notifications module (app/notifications/router.py)
 * only supports CRUD on individual notification records -- there is
 * no global preference/toggle resource (email/browser/AI/ticket
 * channels) anywhere in the architecture, so this is honestly shown
 * as unavailable rather than wired to a nonexistent endpoint.
 */

import { UnavailableNotice } from "./UnavailableNotice";

/**
 * Notification settings.
 *
 * @returns Notification settings component.
 */
export function NotificationSettings(): React.JSX.Element {
  return (
    <UnavailableNotice
      title="Notification Settings"
      reason="Notification channel preferences are not supported by the current backend -- only individual notifications can be listed, read, and deleted."
    />
  );
}

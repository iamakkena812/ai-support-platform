/**
 * Notification summary component.
 */

import type {
  DashboardNotification,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface NotificationSummaryProps {
  /**
   * Recent notifications.
   */
  readonly notifications: readonly DashboardNotification[];
}

/**
 * Returns badge classes for a notification type.
 *
 * @param type - Notification type.
 * @returns Tailwind CSS classes.
 */
function getTypeClasses(
  type: string,
): string {
  switch (
    type.toLowerCase()
  ) {
    case "success":
      return "bg-green-100 text-green-800";

    case "warning":
      return "bg-yellow-100 text-yellow-800";

    case "error":
      return "bg-red-100 text-red-800";

    case "info":
    default:
      return "bg-blue-100 text-blue-800";
  }
}

/**
 * Notification summary.
 *
 * @param props - Component properties.
 * @returns Notification summary component.
 */
export function NotificationSummary({
  notifications,
}: NotificationSummaryProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Notifications
        </h2>
      </div>

      {notifications.length ===
      0 ? (
        <div className="p-8 text-center text-gray-500">
          No notifications
          available.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {notifications.map(
            (
              notification,
            ) => (
              <div
                key={
                  notification.id
                }
                className="flex items-start justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {
                        notification.title
                      }
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeClasses(
                        notification.type,
                      )}`}
                    >
                      {
                        notification.type
                      }
                    </span>

                    {!notification.isRead ? (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                        New
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(
                      notification.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      notification.isRead
                        ? "bg-gray-100 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {notification.isRead
                      ? "Read"
                      : "Unread"}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
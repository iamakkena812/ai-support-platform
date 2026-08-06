/**
 * Notification list component.
 *
 * Displays a collection of notifications.
 */

import { NotificationCard } from "./NotificationCard";

import type { Notification } from "../types/notification.types";

/**
 * Component properties.
 */
export interface NotificationListProps {
  /**
   * Notifications to display.
   */
  readonly notifications: readonly Notification[];

  /**
   * Invoked when a notification is selected.
   */
  readonly onView?: (
    notification: Notification,
  ) => void;

  /**
   * Invoked when editing a notification.
   */
  readonly onEdit?: (
    notification: Notification,
  ) => void;

  /**
   * Invoked when deleting a notification.
   */
  readonly onDelete?: (
    notification: Notification,
  ) => void;

  /**
   * Invoked when marking a notification as read.
   */
  readonly onMarkAsRead?: (
    notification: Notification,
  ) => void;
}

/**
 * Notification list.
 *
 * @param props - Component properties.
 * @returns Notification list component.
 */
export function NotificationList({
  notifications,
  onView,
  onEdit,
  onDelete,
  onMarkAsRead,
}: NotificationListProps): React.JSX.Element {
  if (
    notifications.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No notifications found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(
        (notification) => (
          <div
            key={
              notification.id
            }
            className="rounded-lg border border-transparent transition-colors hover:border-gray-200"
          >
            <NotificationCard
              notification={
                notification
              }
              onClick={
                onView
              }
              onMarkAsRead={
                onMarkAsRead
              }
            />

            <div className="flex justify-end gap-2 rounded-b-lg border-x border-b border-gray-200 bg-gray-50 px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  onView?.(
                    notification,
                  )
                }
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                View
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit?.(
                    notification,
                  )
                }
                className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete?.(
                    notification,
                  )
                }
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
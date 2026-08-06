/**
 * Notification card component.
 *
 * Displays a single notification in a reusable card layout.
 */

import type { Notification } from "../types/notification.types";

/**
 * Component properties.
 */
export interface NotificationCardProps {
  /**
   * Notification to display.
   */
  readonly notification: Notification;

  /**
   * Invoked when the notification is selected.
   */
  readonly onClick?: (
    notification: Notification,
  ) => void;

  /**
   * Invoked when the notification is marked as read.
   */
  readonly onMarkAsRead?: (
    notification: Notification,
  ) => void;
}

/**
 * Notification card.
 *
 * @param props - Component properties.
 * @returns Notification card component.
 */
export function NotificationCard({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationCardProps): React.JSX.Element {
  /**
   * Returns badge classes for the notification type.
   *
   * @param type - Notification type.
   * @returns Tailwind CSS classes.
   */
  const getTypeClasses = (
    type: Notification["type"],
  ): string => {
    switch (type) {
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
  };

  return (
    <div
      className={`rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md ${
        notification.status ===
        "unread"
          ? "border-blue-300 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="min-w-0 flex-1"
          role={
            onClick
              ? "button"
              : undefined
          }
          tabIndex={
            onClick
              ? 0
              : undefined
          }
          onClick={() =>
            onClick?.(
              notification,
            )
          }
          onKeyDown={(
            event,
          ) => {
            if (
              !onClick
            ) {
              return;
            }

            if (
              event.key ===
                "Enter" ||
              event.key ===
                " "
            ) {
              event.preventDefault();

              onClick(
                notification,
              );
            }
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900">
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
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {
              notification.message
            }
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>
              Recipient:{" "}
              {
                notification
                  .recipient
                  .name
              }
            </span>

            <span>
              Status:{" "}
              {
                notification.status
              }
            </span>

            <span>
              {new Date(
                notification.createdAt,
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {notification.status ===
        "unread" ? (
          <button
            type="button"
            onClick={() =>
              onMarkAsRead?.(
                notification,
              )
            }
            className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-100"
          >
            Mark as Read
          </button>
        ) : null}
      </div>
    </div>
  );
}
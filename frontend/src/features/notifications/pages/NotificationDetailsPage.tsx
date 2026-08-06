/**
 * Notification details page.
 */

import { useParams } from "react-router-dom";

import { useNotification } from "../hooks/useNotification";

/**
 * Notification details page.
 *
 * Displays detailed information about a notification.
 *
 * @returns Notification details page component.
 */
export function NotificationDetailsPage(): React.JSX.Element {
  const {
    notificationId = "",
  } = useParams<{
    notificationId: string;
  }>();

  const {
    data: notification,
    isLoading,
    isError,
    error,
  } = useNotification(
    notificationId,
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading notification...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load notification."}
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Notification not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Details
        </h1>

        <p className="mt-2 text-gray-600">
          View notification
          information.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Notification Information
        </h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Title
            </dt>

            <dd className="mt-1 text-gray-900">
              {notification.title}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Type
            </dt>

            <dd className="mt-1">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  notification.type ===
                  "success"
                    ? "bg-green-100 text-green-800"
                    : notification.type ===
                        "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : notification.type ===
                          "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                }`}
              >
                {notification.type}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Status
            </dt>

            <dd className="mt-1 text-gray-900">
              {notification.status}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Recipient
            </dt>

            <dd className="mt-1 text-gray-900">
              {
                notification
                  .recipient
                  .name
              }
            </dd>
          </div>

          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Message
            </dt>

            <dd className="mt-1 whitespace-pre-wrap text-gray-900">
              {
                notification.message
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Action URL
            </dt>

            <dd className="mt-1 break-all text-blue-600">
              {notification.actionUrl ??
                "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Read At
            </dt>

            <dd className="mt-1 text-gray-900">
              {notification.readAt
                ? new Date(
                    notification.readAt,
                  ).toLocaleString()
                : "Not read"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Created At
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                notification.createdAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Updated At
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                notification.updatedAt,
              ).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
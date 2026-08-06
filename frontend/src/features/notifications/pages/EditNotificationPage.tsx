/**
 * Edit notification page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { NotificationForm } from "../components/NotificationForm";
import { useNotification } from "../hooks/useNotification";
import { useUpdateNotification } from "../hooks/useNotifications";

import type { NotificationFormValues } from "../components/NotificationForm";

/**
 * Edit notification page.
 *
 * @returns Edit notification page component.
 */
export function EditNotificationPage(): React.JSX.Element {
  const navigate =
    useNavigate();

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

  const updateNotificationMutation =
    useUpdateNotification();

  /**
   * Handles notification update.
   *
   * @param values - Notification form values.
   */
  const handleSubmit =
    async (
      values: NotificationFormValues,
    ): Promise<void> => {
      await updateNotificationMutation.mutateAsync(
        {
          notificationId,

          payload: {
            title:
              values.title,

            message:
              values.message,

            type:
              values.type,

            status:
              values.status,

            actionUrl:
              values.actionUrl,
          },
        },
      );

      navigate(
        "/notifications",
      );
    };

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
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit
          Notification
        </h1>

        <p className="mt-2 text-gray-600">
          Update notification
          details.
        </p>
      </header>

      <NotificationForm
        initialValue={
          notification
        }
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          updateNotificationMutation.isPending
        }
      />
    </div>
  );
}
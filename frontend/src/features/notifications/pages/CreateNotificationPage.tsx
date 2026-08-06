/**
 * Create notification page.
 */

import { useNavigate } from "react-router-dom";

import {
  NotificationForm,
} from "../components/NotificationForm";
import {
  useCreateNotification,
} from "../hooks/useNotifications";

import type {
  NotificationFormValues,
} from "../components/NotificationForm";

/**
 * Create notification page.
 *
 * @returns Create notification page component.
 */
export function CreateNotificationPage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const createNotificationMutation =
    useCreateNotification();

  /**
   * Handles notification creation.
   *
   * @param values - Notification form values.
   */
  const handleSubmit =
    async (
      values: NotificationFormValues,
    ): Promise<void> => {
      if (
        !values.recipientId
      ) {
        return;
      }

      await createNotificationMutation.mutateAsync(
        {
          recipientId:
            values.recipientId,

          title:
            values.title,

          message:
            values.message,

          type:
            values.type,

          actionUrl:
            values.actionUrl,
        },
      );

      navigate(
        "/notifications",
      );
    };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Create
          Notification
        </h1>

        <p className="mt-2 text-gray-600">
          Create and send a
          notification to a
          user.
        </p>
      </header>

      <NotificationForm
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          createNotificationMutation.isPending
        }
      />
    </div>
  );
}
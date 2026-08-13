/**
 * Notifications page.
 */

import {
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { DeleteNotificationDialog } from "../components/DeleteNotificationDialog";
import { NotificationFilters } from "../components/NotificationFilters";
import { NotificationList } from "../components/NotificationList";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";

import type {
  Notification,
  NotificationFilterValues,
} from "../types/notification.types";

/**
 * Notifications page.
 */
export function NotificationsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [filters, setFilters] =
    useState<NotificationFilterValues>(
      {},
    );

  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null);

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 10,
      filters,
    }),
    [filters],
  );

  const {
    data,
    isLoading,
    isError,
    error,
  } = useNotifications(query);

  const markAsReadMutation =
    useMarkNotificationAsRead();

  const deleteNotificationMutation =
    useDeleteNotification();

  /**
   * Handles viewing a notification.
   *
   * @param notification - Selected notification.
   */
  const handleView = (
    notification: Notification,
  ): void => {
    navigate(`/notifications/${notification.id}`);
  };

  /**
   * Handles editing a notification.
   *
   * @param notification - Selected notification.
   */
  const handleEdit = (
    notification: Notification,
  ): void => {
    navigate(`/notifications/${notification.id}/edit`);
  };

  /**
   * Handles deleting a notification.
   *
   * @param notification - Selected notification.
   */
  const handleDelete = (
    notification: Notification,
  ): void => {
    setNotificationToDelete(notification);
  };

  /**
   * Confirms deletion of the selected notification.
   *
   * @param notification - Notification to delete.
   */
  const handleConfirmDelete = async (
    notification: Notification,
  ): Promise<void> => {
    await deleteNotificationMutation.mutateAsync(notification.id);
    setNotificationToDelete(null);
  };

  /**
   * Handles marking a notification as read.
   *
   * @param notification - Selected notification.
   */
  const handleMarkAsRead = async (
    notification: Notification,
  ): Promise<void> => {
    try {
      await markAsReadMutation.mutateAsync(
        notification.id,
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read.",
        error,
      );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-gray-600">
            View and manage system
            notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/notifications/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create Notification
        </button>
      </header>

      <NotificationFilters
        initialValue={filters}
        onChange={setFilters}
      />

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading notifications...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load notifications."}
        </div>
      ) : null}

      {!isLoading &&
      !isError ? (
        <NotificationList
          notifications={
            data?.items ?? []
          }
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkAsRead={
            handleMarkAsRead
          }
        />
      ) : null}

      {notificationToDelete ? (
        <DeleteNotificationDialog
          notification={notificationToDelete}
          isOpen
          isDeleting={deleteNotificationMutation.isPending}
          onClose={() => setNotificationToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
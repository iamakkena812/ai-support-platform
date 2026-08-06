/**
 * Notification API client.
 *
 * Provides low-level HTTP operations for notification resources.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateNotificationRequest,
  Notification,
  NotificationListQuery,
  NotificationListResponse,
  NotificationStatistics,
  UpdateNotificationRequest,
} from "../types/notification.types";

/**
 * Notifications API endpoint.
 */
const BASE_PATH =
  "/notifications";

/**
 * Retrieves a paginated list of notifications.
 *
 * @param query - Notification query parameters.
 * @returns Paginated notification response.
 */
export const getNotifications =
  async (
    query?: NotificationListQuery,
  ): Promise<NotificationListResponse> => {
    const {
      data,
    } =
      await apiClient.get<NotificationListResponse>(
        BASE_PATH,
        {
          params:
            query,
        },
      );

    return data;
  };

/**
 * Retrieves a notification by identifier.
 *
 * @param notificationId - Notification identifier.
 * @returns Notification.
 */
export const getNotification =
  async (
    notificationId: string,
  ): Promise<Notification> => {
    const {
      data,
    } =
      await apiClient.get<Notification>(
        `${BASE_PATH}/${notificationId}`,
      );

    return data;
  };

/**
 * Creates a notification.
 *
 * @param payload - Notification creation payload.
 * @returns Created notification.
 */
export const createNotification =
  async (
    payload: CreateNotificationRequest,
  ): Promise<Notification> => {
    const {
      data,
    } =
      await apiClient.post<Notification>(
        BASE_PATH,
        payload,
      );

    return data;
  };

/**
 * Updates a notification.
 *
 * @param notificationId - Notification identifier.
 * @param payload - Update payload.
 * @returns Updated notification.
 */
export const updateNotification =
  async (
    notificationId: string,
    payload: UpdateNotificationRequest,
  ): Promise<Notification> => {
    const {
      data,
    } =
      await apiClient.put<Notification>(
        `${BASE_PATH}/${notificationId}`,
        payload,
      );

    return data;
  };

/**
 * Deletes a notification.
 *
 * @param notificationId - Notification identifier.
 */
export const deleteNotification =
  async (
    notificationId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${BASE_PATH}/${notificationId}`,
    );
  };

/**
 * Marks a notification as read.
 *
 * @param notificationId - Notification identifier.
 * @returns Updated notification.
 */
export const markNotificationAsRead =
  async (
    notificationId: string,
  ): Promise<Notification> => {
    const {
      data,
    } =
      await apiClient.patch<Notification>(
        `${BASE_PATH}/${notificationId}/read`,
      );

    return data;
  };

/**
 * Retrieves notification statistics.
 *
 * @returns Notification statistics.
 */
export const getNotificationStatistics =
  async (): Promise<NotificationStatistics> => {
    const {
      data,
    } =
      await apiClient.get<NotificationStatistics>(
        `${BASE_PATH}/statistics`,
      );

    return data;
  };
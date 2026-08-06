/**
 * Notification service.
 *
 * Provides the service layer between the UI and the
 * notification API client.
 */

import {
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  getNotificationStatistics,
  markNotificationAsRead,
  updateNotification,
} from "../api/notification.api";

import type {
  CreateNotificationRequest,
  Notification,
  NotificationListQuery,
  NotificationListResponse,
  NotificationStatistics,
  UpdateNotificationRequest,
} from "../types/notification.types";

/**
 * Notification service.
 */
export const notificationService = {
  /**
   * Retrieves a paginated list of notifications.
   *
   * @param query - Notification query parameters.
   * @returns Paginated notification response.
   */
  async getNotifications(
    query?: NotificationListQuery,
  ): Promise<NotificationListResponse> {
    return getNotifications(
      query,
    );
  },

  /**
   * Retrieves a notification by identifier.
   *
   * @param notificationId - Notification identifier.
   * @returns Notification.
   */
  async getNotification(
    notificationId: string,
  ): Promise<Notification> {
    return getNotification(
      notificationId,
    );
  },

  /**
   * Creates a notification.
   *
   * @param payload - Notification creation payload.
   * @returns Created notification.
   */
  async createNotification(
    payload: CreateNotificationRequest,
  ): Promise<Notification> {
    return createNotification(
      payload,
    );
  },

  /**
   * Updates a notification.
   *
   * @param notificationId - Notification identifier.
   * @param payload - Update payload.
   * @returns Updated notification.
   */
  async updateNotification(
    notificationId: string,
    payload: UpdateNotificationRequest,
  ): Promise<Notification> {
    return updateNotification(
      notificationId,
      payload,
    );
  },

  /**
   * Deletes a notification.
   *
   * @param notificationId - Notification identifier.
   */
  async deleteNotification(
    notificationId: string,
  ): Promise<void> {
    return deleteNotification(
      notificationId,
    );
  },

  /**
   * Marks a notification as read.
   *
   * @param notificationId - Notification identifier.
   * @returns Updated notification.
   */
  async markAsRead(
    notificationId: string,
  ): Promise<Notification> {
    return markNotificationAsRead(
      notificationId,
    );
  },

  /**
   * Retrieves notification statistics.
   *
   * @returns Notification statistics.
   */
  async getNotificationStatistics(): Promise<NotificationStatistics> {
    return getNotificationStatistics();
  },
};
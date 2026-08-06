/**
 * React Query hooks for notification collection operations.
 *
 * Provides hooks for listing, creating, updating,
 * deleting, marking notifications as read,
 * and retrieving notification statistics.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationQueryKeys } from "./useNotification";
import { notificationService } from "../services/notification.service";

import type {
  CreateNotificationRequest,
  Notification,
  NotificationListQuery,
  NotificationListResponse,
  NotificationStatistics,
  UpdateNotificationRequest,
} from "../types/notification.types";

/**
 * Statistics query key.
 */
const notificationStatisticsQueryKey = [
  ...notificationQueryKeys.all,
  "statistics",
] as const;

/**
 * Retrieves a paginated list of notifications.
 *
 * @param query - Notification query.
 * @returns React Query result.
 */
export function useNotifications(
  query?: NotificationListQuery,
) {
  return useQuery<NotificationListResponse>({
    queryKey: [
      ...notificationQueryKeys.all,
      "list",
      query,
    ] as const,

    queryFn: () =>
      notificationService.getNotifications(
        query,
      ),
  });
}

/**
 * Retrieves notification statistics.
 *
 * @returns React Query result.
 */
export function useNotificationStatistics() {
  return useQuery<NotificationStatistics>({
    queryKey:
      notificationStatisticsQueryKey,

    queryFn: () =>
      notificationService.getNotificationStatistics(),
  });
}

/**
 * Creates a notification.
 *
 * @returns Mutation.
 */
export function useCreateNotification() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Notification,
    Error,
    CreateNotificationRequest
  >({
    mutationFn: (
      payload,
    ) =>
      notificationService.createNotification(
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey:
            notificationQueryKeys.all,
        },
      );
    },
  });
}

/**
 * Notification update variables.
 */
interface UpdateNotificationVariables {
  /**
   * Notification identifier.
   */
  readonly notificationId: string;

  /**
   * Update payload.
   */
  readonly payload: UpdateNotificationRequest;
}

/**
 * Updates a notification.
 *
 * @returns Mutation.
 */
export function useUpdateNotification() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Notification,
    Error,
    UpdateNotificationVariables
  >({
    mutationFn: ({
      notificationId,
      payload,
    }) =>
      notificationService.updateNotification(
        notificationId,
        payload,
      ),

    onSuccess: async (
      _,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries(
          {
            queryKey:
              notificationQueryKeys.all,
          },
        ),

        queryClient.invalidateQueries(
          {
            queryKey:
              notificationQueryKeys.detail(
                variables.notificationId,
              ),
          },
        ),
      ]);
    },
  });
}

/**
 * Deletes a notification.
 *
 * @returns Mutation.
 */
export function useDeleteNotification() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (
      notificationId,
    ) =>
      notificationService.deleteNotification(
        notificationId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey:
            notificationQueryKeys.all,
        },
      );
    },
  });
}

/**
 * Marks a notification as read.
 *
 * @returns Mutation.
 */
export function useMarkNotificationAsRead() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Notification,
    Error,
    string
  >({
    mutationFn: (
      notificationId,
    ) =>
      notificationService.markAsRead(
        notificationId,
      ),

    onSuccess: async (
      _,
      notificationId,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries(
          {
            queryKey:
              notificationQueryKeys.all,
          },
        ),

        queryClient.invalidateQueries(
          {
            queryKey:
              notificationQueryKeys.detail(
                notificationId,
              ),
          },
        ),
      ]);
    },
  });
}
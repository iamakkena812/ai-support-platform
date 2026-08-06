/**
 * React Query hook for retrieving a single notification.
 *
 * Provides cached access to an individual notification.
 */

import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../services/notification.service";

import type { Notification } from "../types/notification.types";

/**
 * Notification query keys.
 */
export const notificationQueryKeys = {
  /**
   * Root query key.
   */
  all: ["notifications"] as const,

  /**
   * Detail query key.
   *
   * @param notificationId - Notification identifier.
   * @returns Query key.
   */
  detail: (
    notificationId: string,
  ) =>
    [
      ...notificationQueryKeys.all,
      "detail",
      notificationId,
    ] as const,
};

/**
 * Retrieves a notification.
 *
 * @param notificationId - Notification identifier.
 * @returns React Query result.
 */
export function useNotification(
  notificationId: string,
) {
  return useQuery<Notification>({
    queryKey:
      notificationQueryKeys.detail(
        notificationId,
      ),

    queryFn: () =>
      notificationService.getNotification(
        notificationId,
      ),

    enabled:
      notificationId.trim().length >
      0,
  });
}
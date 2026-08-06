/**
 * Notification domain types.
 *
 * Defines the TypeScript models used throughout the
 * Notifications feature.
 */

/**
 * Notification type.
 */
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error";

/**
 * Notification status.
 */
export type NotificationStatus =
  | "unread"
  | "read";

/**
 * Notification recipient.
 */
export interface NotificationRecipient {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * User display name.
   */
  readonly name: string;

  /**
   * User email.
   */
  readonly email?: string | null;

  /**
   * User avatar URL.
   */
  readonly avatarUrl?: string | null;
}

/**
 * Notification entity.
 */
export interface Notification {
  /**
   * Notification identifier.
   */
  readonly id: string;

  /**
   * Notification title.
   */
  readonly title: string;

  /**
   * Notification message.
   */
  readonly message: string;

  /**
   * Notification type.
   */
  readonly type: NotificationType;

  /**
   * Notification status.
   */
  readonly status: NotificationStatus;

  /**
   * Recipient.
   */
  readonly recipient: NotificationRecipient;

  /**
   * Optional action URL.
   */
  readonly actionUrl?: string | null;

  /**
   * Read timestamp.
   */
  readonly readAt?: string | null;

  /**
   * Creation timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Create notification request.
 */
export interface CreateNotificationRequest {
  /**
   * Recipient identifier.
   */
  readonly recipientId: string;

  /**
   * Notification title.
   */
  readonly title: string;

  /**
   * Notification message.
   */
  readonly message: string;

  /**
   * Notification type.
   */
  readonly type: NotificationType;

  /**
   * Optional action URL.
   */
  readonly actionUrl?: string | null;
}

/**
 * Update notification request.
 */
export interface UpdateNotificationRequest {
  /**
   * Notification title.
   */
  readonly title?: string;

  /**
   * Notification message.
   */
  readonly message?: string;

  /**
   * Notification type.
   */
  readonly type?: NotificationType;

  /**
   * Notification status.
   */
  readonly status?: NotificationStatus;

  /**
   * Action URL.
   */
  readonly actionUrl?: string | null;
}

/**
 * Notification filter values.
 */
export interface NotificationFilterValues {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Notification type.
   */
  readonly type?: NotificationType;

  /**
   * Notification status.
   */
  readonly status?: NotificationStatus;

  /**
   * Recipient identifier.
   */
  readonly recipientId?: string;
}

/**
 * Sort direction.
 */
export type SortDirection =
  | "asc"
  | "desc";

/**
 * Notification sorting.
 */
export interface NotificationSort {
  /**
   * Sort field.
   */
  readonly field: keyof Notification;

  /**
   * Sort direction.
   */
  readonly direction: SortDirection;
}

/**
 * Notification list query.
 */
export interface NotificationListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;

  /**
   * Filter values.
   */
  readonly filters?: NotificationFilterValues;

  /**
   * Sort definition.
   */
  readonly sort?: NotificationSort;
}

/**
 * Paginated notification response.
 */
export interface NotificationListResponse {
  /**
   * Returned notifications.
   */
  readonly items: readonly Notification[];

  /**
   * Total records.
   */
  readonly total: number;

  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Page size.
   */
  readonly pageSize: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;
}

/**
 * Notification statistics.
 */
export interface NotificationStatistics {
  /**
   * Total notifications.
   */
  readonly total: number;

  /**
   * Unread notifications.
   */
  readonly unread: number;

  /**
   * Read notifications.
   */
  readonly read: number;
}
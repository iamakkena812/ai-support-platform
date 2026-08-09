/**
 * Permission page header.
 *
 * Provides the title, description, and primary actions
 * for the Permissions feature.
 */

import type { ReactNode } from "react";

import { PageHeader } from "../../../components/common/PageHeader";

/**
 * Permission header properties.
 */
export interface PermissionHeaderProps {
  /**
   * Header title.
   *
   * @default "Permissions"
   */
  readonly title?: string;

  /**
   * Header description.
   */
  readonly description?: string;

  /**
   * Optional action content.
   */
  readonly actions?: ReactNode;
}

/**
 * Permission page header.
 *
 * @param props - Component properties.
 * @returns Permission page header.
 */
export function PermissionHeader({
  title = "Permissions",
  description = "Manage platform permissions and access controls.",
  actions,
}: PermissionHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
    />
  );
}
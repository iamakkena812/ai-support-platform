/**
 * User card component.
 *
 * Displays user information
 * in a card layout.
 */

import {
  Building2,
  Mail,
  Phone,
} from "lucide-react";

import {
  UserActions,
} from "./UserActions";

import {
  UserAvatar,
} from "./UserAvatar";

import {
  UserRoles,
} from "./UserRoles";

import {
  UserStatusBadge,
} from "./UserStatusBadge";

/**
 * Component properties.
 */
export interface UserCardProps {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * User full name.
   */
  readonly name: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Organization.
   */
  readonly organization?: string;

  /**
   * Roles.
   */
  readonly roles: readonly string[];

  /**
   * Status.
   */
  readonly status: string;

  /**
   * Avatar image.
   */
  readonly avatarUrl?: string;

  /**
   * View callback.
   */
  readonly onView?: (
    id: string,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    id: string,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    id: string,
  ) => void;
}

/**
 * User card.
 *
 * @param props Component properties.
 * @returns User card.
 */
export function UserCard({
  id,
  name,
  email,
  phone,
  organization,
  roles,
  status,
  avatarUrl,
  onView,
  onEdit,
  onDelete,
}: UserCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={name}
            imageUrl={avatarUrl}
            size="lg"
          />

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {name}
            </h3>

            <UserStatusBadge
              status={status}
            />
          </div>
        </div>

        <UserActions
          onView={
            onView
              ? () => onView(id)
              : undefined
          }
          onEdit={
            onEdit
              ? () => onEdit(id)
              : undefined
          }
          onDelete={
            onDelete
              ? () => onDelete(id)
              : undefined
          }
        />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Mail
            size={16}
          />

          {email}
        </div>

        {phone ? (
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Phone
              size={16}
            />

            {phone}
          </div>
        ) : null}

        {organization ? (
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Building2
              size={16}
            />

            {organization}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <UserRoles
          roles={roles}
        />
      </div>
    </div>
  );
}
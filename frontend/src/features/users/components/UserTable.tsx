/**
 * User table component.
 *
 * Displays users in a responsive table.
 */

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
 * User row.
 */
export interface UserTableRow {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * Full name.
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
   * Avatar URL.
   */
  readonly avatarUrl?: string;

  /**
   * User roles.
   */
  readonly roles: readonly string[];

  /**
   * Status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface UserTableProps {
  /**
   * Users.
   */
  readonly users: readonly UserTableRow[];

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
 * User table.
 *
 * @param props Component properties.
 * @returns User table component.
 */
export function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
}: UserTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                User
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Organization
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Roles
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {users.map(
              (user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        imageUrl={
                          user.avatarUrl
                        }
                        size="sm"
                      />

                      <div>
                        <div className="font-medium text-slate-900">
                          {user.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {user.email}
                        </div>

                        {user.phone ? (
                          <div className="text-xs text-slate-400">
                            {user.phone}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {user.organization ??
                      "-"}
                  </td>

                  <td className="px-6 py-4">
                    <UserRoles
                      roles={
                        user.roles
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    <UserStatusBadge
                      status={
                        user.status
                      }
                    />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <UserActions
                      onView={
                        onView
                          ? () =>
                              onView(
                                user.id,
                              )
                          : undefined
                      }
                      onEdit={
                        onEdit
                          ? () =>
                              onEdit(
                                user.id,
                              )
                          : undefined
                      }
                      onDelete={
                        onDelete
                          ? () =>
                              onDelete(
                                user.id,
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
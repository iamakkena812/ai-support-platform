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

import type {
  User,
} from "../types/user.types";


/**
 * Component properties.
 */
export interface UserTableProps {

  /**
   * Users.
   */
  readonly users: readonly User[];


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
export function UserTable(
  {
    users,
    onView,
    onEdit,
    onDelete,
  }: UserTableProps,
): React.JSX.Element {

  return (
    <div
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white"
    >

      <table
        className="min-w-full"
      >

        <thead
          className="bg-slate-50"
        >

          <tr>

            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              User
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Username
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Status
            </th>


            <th
              className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700"
            >
              Actions
            </th>

          </tr>

        </thead>


        <tbody
          className="divide-y divide-slate-200"
        >

          {
            users.map(
              (user) => (
                <tr
                  key={
                    user.id
                  }
                  className="hover:bg-slate-50"
                >

                  <td
                    className="px-6 py-4"
                  >

                    <div
                      className="flex items-center gap-3"
                    >

                      <UserAvatar
                        name={
                          user.fullName
                        }
                        size="sm"
                      />


                      <div>

                        <div
                          className="font-medium text-slate-900"
                        >
                          {
                            user.fullName
                          }
                        </div>


                        <div
                          className="text-sm text-slate-500"
                        >
                          {
                            user.email
                          }
                        </div>

                      </div>

                    </div>

                  </td>


                  <td
                    className="px-6 py-4 text-sm text-slate-700"
                  >
                    {
                      user.username
                    }
                  </td>


                  <td
                    className="px-6 py-4"
                  >

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {
                        user.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    </span>

                  </td>


                  <td
                    className="px-6 py-4 text-right"
                  >

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
            )
          }

        </tbody>

      </table>

    </div>
  );
}

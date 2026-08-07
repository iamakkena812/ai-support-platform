/**
 * Role table component.
 *
 * Displays roles in a responsive
 * table layout.
 */

import {
  RoleActions,
} from "./RoleActions";

import {
  RoleStatusBadge,
} from "./RoleStatusBadge";



/**
 * Role table row.
 */
export interface RoleTableRow {


  /**
   * Role identifier.
   */
  readonly id: string;



  /**
   * Role name.
   */
  readonly name: string;



  /**
   * Description.
   */
  readonly description?: string;



  /**
   * Permission count.
   */
  readonly permissionCount: number;



  /**
   * User count.
   */
  readonly userCount: number;



  /**
   * Status.
   */
  readonly status: string;



  /**
   * System role.
   */
  readonly isSystem: boolean;

}



/**
 * Component properties.
 */
export interface RoleTableProps {


  /**
   * Roles.
   */
  readonly roles: readonly RoleTableRow[];



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
 * Role table component.
 *
 * @param props Component properties.
 * @returns Role table.
 */
export function RoleTable({
  roles,
  onView,
  onEdit,
  onDelete,
}: RoleTableProps): React.JSX.Element {


  return (

    <div
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white"
    >

      <table
        className="min-w-full divide-y divide-slate-200"
      >

        <thead
          className="bg-slate-50"
        >

          <tr>

            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Role
            </th>


            <th
              className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
            >
              Permissions
            </th>


            <th
              className="px-6 py-4 text-center text-sm font-semibold text-slate-700"
            >
              Users
            </th>


            <th
              className="px-6 py-4 text-center text-sm font-semibold text-slate-700"
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
            roles.map(
              (role) => (

                <tr

                  key={
                    role.id
                  }

                  className="hover:bg-slate-50"

                >

                  <td
                    className="px-6 py-4"
                  >

                    <div
                      className="flex items-center gap-3"
                    >

                      <div

                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white"

                      >

                        {
                          role.name
                            .charAt(0)
                            .toUpperCase()
                        }

                      </div>



                      <div>

                        <p

                          className="font-medium text-slate-900"

                        >

                          {role.name}

                        </p>



                        {
                          role.isSystem ? (

                            <span

                              className="text-xs font-medium text-purple-600"

                            >

                              System Role

                            </span>

                          ) : null
                        }

                      </div>

                    </div>

                  </td>



                  <td
                    className="px-6 py-4 text-sm text-slate-700"
                  >

                    {role.permissionCount}

                  </td>



                  <td

                    className="px-6 py-4 text-center text-sm text-slate-700"

                  >

                    {role.userCount}

                  </td>



                  <td

                    className="px-6 py-4 text-center"

                  >

                    <RoleStatusBadge

                      status={
                        role.status
                      }

                    />

                  </td>



                  <td

                    className="px-6 py-4 text-right"

                  >

                    <RoleActions

                      onView={
                        onView
                          ? () =>
                              onView(
                                role.id,
                              )
                          : undefined
                      }


                      onEdit={
                        onEdit
                          ? () =>
                              onEdit(
                                role.id,
                              )
                          : undefined
                      }


                      onDelete={
                        onDelete
                          ? () =>
                              onDelete(
                                role.id,
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
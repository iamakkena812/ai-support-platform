/**
 * Role permissions component.
 *
 * Displays permissions assigned
 * to a role.
 */

import {
  Check,
  KeyRound,
} from "lucide-react";


/**
 * Permission item.
 */
export interface RolePermissionItem {


  /**
   * Permission identifier.
   */
  readonly id: string;



  /**
   * Permission name.
   */
  readonly name: string;



  /**
   * Permission description.
   */
  readonly description?: string;



  /**
   * Selected state.
   */
  readonly selected?: boolean;

}



/**
 * Component properties.
 */
export interface RolePermissionsProps {


  /**
   * Permissions.
   */
  readonly permissions: readonly RolePermissionItem[];



  /**
   * Selected permission ids.
   */
  readonly selectedIds?: readonly string[];



  /**
   * Selection callback.
   */
  readonly onChange?: (
    ids: readonly string[],
  ) => void;



  /**
   * Read only mode.
   */
  readonly readOnly?: boolean;

}



/**
 * Role permissions component.
 *
 * @param props Component properties.
 * @returns Role permissions component.
 */
export function RolePermissions({
  permissions,
  selectedIds = [],
  onChange,
  readOnly = false,
}: RolePermissionsProps): React.JSX.Element {


  function togglePermission(
    id: string,
  ): void {

    if (
      readOnly ||
      !onChange
    ) {

      return;

    }


    const exists =
      selectedIds.includes(
        id,
      );


    const updated =
      exists

        ? selectedIds.filter(
            (
              permissionId,
            ) =>
              permissionId !== id,
          )

        : [
            ...selectedIds,
            id,
          ];


    onChange(
      updated,
    );

  }



  return (

    <div
      className="space-y-4"
    >

      <h3
        className="text-lg font-semibold text-slate-900"
      >
        Permissions
      </h3>



      {
        permissions.length === 0 ? (

          <p
            className="text-sm text-slate-500"
          >
            No permissions available.
          </p>

        ) : (

          <div
            className="grid gap-3 md:grid-cols-2"
          >

            {
              permissions.map(
                (
                  permission,
                ) => {

                  const checked =
                    selectedIds.includes(
                      permission.id,
                    );


                  return (

                    <button

                      key={
                        permission.id
                      }

                      type="button"

                      disabled={
                        readOnly
                      }

                      onClick={() =>
                        togglePermission(
                          permission.id,
                        )
                      }

                      className={[
                        "flex items-start gap-3 rounded-lg border p-4 text-left transition",
                        checked
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50",
                        readOnly
                          ? "cursor-default"
                          : "",
                      ].join(" ")}

                    >

                      <div
                        className="mt-1"
                      >

                        {
                          checked ? (

                            <div
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
                            >

                              <Check
                                size={14}
                              />

                            </div>

                          ) : (

                            <KeyRound
                              size={18}
                              className="text-slate-400"
                            />

                          )

                        }

                      </div>



                      <div>

                        <p
                          className="font-medium text-slate-900"
                        >
                          {
                            permission.name
                          }
                        </p>


                        <p
                          className="mt-1 text-sm text-slate-500"
                        >
                          {
                            permission.description ??
                            "No description available."
                          }
                        </p>

                      </div>


                    </button>

                  );

                },
              )
            }

          </div>

        )
      }


    </div>

  );

}
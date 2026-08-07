/**
 * Permission matrix component.
 *
 * Displays permissions grouped by module
 * with selection controls.
 */

import {
  Check,
} from "lucide-react";



/**
 * Permission matrix item.
 */
export interface PermissionMatrixItem {


  /**
   * Permission identifier.
   */
  readonly id: string;



  /**
   * Permission module.
   */
  readonly module: string;



  /**
   * Permission name.
   */
  readonly name: string;



  /**
   * Permission description.
   */
  readonly description?: string;

}



/**
 * Component properties.
 */
export interface PermissionMatrixProps {


  /**
   * Permissions.
   */
  readonly permissions: readonly PermissionMatrixItem[];



  /**
   * Selected permission ids.
   */
  readonly selectedIds: readonly string[];



  /**
   * Change callback.
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
 * Permission matrix component.
 *
 * @param props Component properties.
 * @returns Permission matrix.
 */
export function PermissionMatrix({
  permissions,
  selectedIds,
  onChange,
  readOnly = false,
}: PermissionMatrixProps): React.JSX.Element {


  const modules =
    Array.from(
      new Set(
        permissions.map(
          (
            permission,
          ) =>
            permission.module,
        ),
      ),
    );



  function togglePermission(
    id: string,
  ): void {

    if (
      readOnly ||
      !onChange
    ) {

      return;

    }


    const selected =
      selectedIds.includes(
        id,
      );


    const updated =
      selected

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
      className="space-y-6"
    >

      {
        modules.map(
          (
            module,
          ) => (

            <section

              key={
                module
              }

              className="rounded-lg border border-slate-200 bg-white"

            >

              <header

                className="border-b border-slate-200 bg-slate-50 px-5 py-3"

              >

                <h3

                  className="font-semibold text-slate-900"

                >

                  {module}

                </h3>


              </header>



              <div

                className="divide-y divide-slate-100"

              >

                {
                  permissions

                    .filter(
                      (
                        permission,
                      ) =>
                        permission.module ===
                        module,
                    )

                    .map(
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
                              "flex w-full items-center justify-between px-5 py-4 text-left transition",
                              checked
                                ? "bg-blue-50"
                                : "hover:bg-slate-50",
                              readOnly
                                ? "cursor-default"
                                : "",
                            ].join(" ")}

                          >

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



                            <div

                              className={[
                                "flex h-6 w-6 items-center justify-center rounded border",
                                checked
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300",
                              ].join(" ")}

                            >

                              {
                                checked ? (

                                  <Check
                                    size={16}
                                  />

                                ) : null
                              }

                            </div>


                          </button>

                        );

                      },
                    )
                }

              </div>


            </section>

          ),
        )
      }


    </div>

  );

}
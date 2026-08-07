/**
 * Role card component.
 *
 * Displays role information
 * in a card layout.
 */

import {
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  RoleActions,
} from "./RoleActions";

import {
  RoleStatusBadge,
} from "./RoleStatusBadge";


/**
 * Component properties.
 */
export interface RoleCardProps {


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
   * Role status.
   */
  readonly status: string;



  /**
   * System role flag.
   */
  readonly isSystem: boolean;



  /**
   * Permission count.
   */
  readonly permissionCount: number;



  /**
   * User count.
   */
  readonly userCount: number;



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
 * Role card component.
 *
 * @param props Component properties.
 * @returns Role card component.
 */
export function RoleCard({
  id,
  name,
  description,
  status,
  isSystem,
  permissionCount,
  userCount,
  onView,
  onEdit,
  onDelete,
}: RoleCardProps): React.JSX.Element {


  return (

    <div

      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

    >

      <div

        className="flex items-start justify-between"

      >

        <div
          className="flex items-center gap-4"
        >

          <div

            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white"

          >

            {
              name
                .charAt(0)
                .toUpperCase()
            }

          </div>



          <div>

            <h3

              className="text-lg font-semibold text-slate-900"

            >

              {name}

            </h3>


            <RoleStatusBadge
              status={
                status
              }
            />

          </div>

        </div>



        <RoleActions

          onView={
            onView
              ? () =>
                  onView(
                    id,
                  )
              : undefined
          }


          onEdit={
            onEdit
              ? () =>
                  onEdit(
                    id,
                  )
              : undefined
          }


          onDelete={
            onDelete
              ? () =>
                  onDelete(
                    id,
                  )
              : undefined
          }

        />

      </div>



      <p

        className="mt-4 text-sm text-slate-600"

      >

        {
          description ??
          "No description available."
        }

      </p>



      <div

        className="mt-5 space-y-3"

      >

        <div

          className="flex items-center gap-3 text-sm text-slate-600"

        >

          <ShieldCheck
            size={16}
          />

          <span>

            {permissionCount} Permission
            {
              permissionCount === 1
                ? ""
                : "s"
            }

          </span>

        </div>



        <div

          className="flex items-center gap-3 text-sm text-slate-600"

        >

          <Users
            size={16}
          />

          <span>

            {userCount} User
            {
              userCount === 1
                ? ""
                : "s"
            }

          </span>

        </div>



        {
          isSystem ? (

            <span

              className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"

            >

              System Role

            </span>

          ) : null
        }


      </div>


    </div>

  );

}
/**
 * Role details component.
 *
 * Displays detailed information
 * about a role.
 */

import {
  Calendar,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  RoleStatusBadge,
} from "./RoleStatusBadge";


/**
 * Permission item.
 */
export interface RolePermission {


  /**
   * Permission identifier.
   */
  readonly id: string;


  /**
   * Permission name.
   */
  readonly name: string;


  /**
   * Description.
   */
  readonly description?: string | null;

}



/**
 * User item.
 */
export interface RoleAssignedUser {


  /**
   * User identifier.
   */
  readonly id: string;


  /**
   * User name.
   */
  readonly name: string;


  /**
   * User email.
   */
  readonly email: string;

}



/**
 * Component properties.
 */
export interface RoleDetailsProps {


  /**
   * Role name.
   */
  readonly name: string;



  /**
   * Description.
   */
  readonly description?: string;



  /**
   * Status.
   */
  readonly status: string;



  /**
   * System role.
   */
  readonly isSystem: boolean;



  /**
   * Permissions.
   */
  readonly permissions: readonly RolePermission[];



  /**
   * Users.
   */
  readonly users: readonly RoleAssignedUser[];



  /**
   * Created date.
   */
  readonly createdAt: string | Date;



  /**
   * Updated date.
   */
  readonly updatedAt?: string | Date;

}



/**
 * Role details component.
 *
 * @param props Component properties.
 * @returns Role details component.
 */
export function RoleDetails({
  name,
  description,
  status,
  isSystem,
  permissions,
  users,
  createdAt,
  updatedAt,
}: RoleDetailsProps): React.JSX.Element {


  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(
          createdAt,
        );


  const updated =
    updatedAt
      ? updatedAt instanceof Date
        ? updatedAt
        : new Date(
            updatedAt,
          )
      : null;



  return (

    <section
      className="space-y-8"
    >


      <div
        className="flex items-start gap-5"
      >

        <div

          className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"

        >

          {
            name
              .charAt(0)
              .toUpperCase()
          }

        </div>



        <div
          className="flex-1"
        >

          <div
            className="flex flex-wrap items-center gap-3"
          >

            <h2
              className="text-2xl font-bold text-slate-900"
            >
              {name}
            </h2>


            <RoleStatusBadge
              status={status}
            />


            {
              isSystem ? (

                <span

                  className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"

                >
                  System Role
                </span>

              ) : null
            }

          </div>


          <p
            className="mt-2 text-slate-600"
          >
            {
              description ??
              "No description available."
            }
          </p>

        </div>


      </div>



      <div
        className="grid gap-6 md:grid-cols-2"
      >

        <DetailItem

          icon={
            <ShieldCheck
              size={18}
            />
          }

          label="Permissions"

          value={
            permissions.length.toString()
          }

        />



        <DetailItem

          icon={
            <Users
              size={18}
            />
          }

          label="Assigned Users"

          value={
            users.length.toString()
          }

        />



        <DetailItem

          icon={
            <Calendar
              size={18}
            />
          }

          label="Created"

          value={
            created.toLocaleString()
          }

        />



        <DetailItem

          icon={
            <Calendar
              size={18}
            />
          }

          label="Updated"

          value={
            updated
              ? updated.toLocaleString()
              : "-"
          }

        />

      </div>



      <div>

        <h3
          className="mb-4 text-lg font-semibold text-slate-900"
        >
          Permissions
        </h3>


        {
          permissions.length === 0 ? (

            <p
              className="text-sm text-slate-500"
            >
              No permissions assigned.
            </p>

          ) : (

            <div
              className="space-y-3"
            >

              {
                permissions.map(
                  (
                    permission,
                  ) => (

                    <div

                      key={
                        permission.id
                      }

                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"

                    >

                      <KeyRound
                        size={18}
                        className="text-blue-600"
                      />


                      <div>

                        <p
                          className="font-medium text-slate-900"
                        >
                          {permission.name}
                        </p>


                        <p
                          className="text-sm text-slate-500"
                        >
                          {
                            permission.description ??
                            "No description"
                          }
                        </p>

                      </div>

                    </div>

                  ),
                )
              }

            </div>

          )

        }

      </div>


    </section>

  );

}



/**
 * Detail item properties.
 */
interface DetailItemProps {


  readonly icon: React.JSX.Element;


  readonly label: string;


  readonly value: string;

}



/**
 * Detail item.
 */
function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps): React.JSX.Element {

  return (

    <div
      className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
    >

      <div>
        {icon}
      </div>


      <div>

        <p
          className="text-sm text-slate-500"
        >
          {label}
        </p>


        <p
          className="font-medium text-slate-900"
        >
          {value}
        </p>

      </div>


    </div>

  );

}
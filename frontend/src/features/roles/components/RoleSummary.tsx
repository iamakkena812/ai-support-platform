/**
 * Role summary component.
 *
 * Displays a summary of a role.
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
 * Component properties.
 */
export interface RoleSummaryProps {


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
   * System role indicator.
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
   * Created date.
   */
  readonly createdAt: string | Date;

}



/**
 * Role summary component.
 *
 * @param props Component properties.
 * @returns Role summary.
 */
export function RoleSummary({
  name,
  description,
  status,
  isSystem,
  permissionCount,
  userCount,
  createdAt,
}: RoleSummaryProps): React.JSX.Element {


  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(
          createdAt,
        );



  return (

    <section

      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

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

              status={
                status
              }

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

        className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"

      >

        <SummaryItem

          icon={
            <ShieldCheck
              size={18}
              className="text-blue-600"
            />
          }

          label="Status"

          value={
            status
          }

        />



        <SummaryItem

          icon={
            <KeyRound
              size={18}
              className="text-green-600"
            />
          }

          label="Permissions"

          value={
            permissionCount.toString()
          }

        />



        <SummaryItem

          icon={
            <Users
              size={18}
              className="text-purple-600"
            />
          }

          label="Users"

          value={
            userCount.toString()
          }

        />



        <SummaryItem

          icon={
            <Calendar
              size={18}
              className="text-orange-600"
            />
          }

          label="Created"

          value={
            created.toLocaleDateString()
          }

        />


      </div>


    </section>

  );

}



/**
 * Summary item properties.
 */
interface SummaryItemProps {


  /**
   * Icon.
   */
  readonly icon: React.JSX.Element;



  /**
   * Label.
   */
  readonly label: string;



  /**
   * Value.
   */
  readonly value: string;

}



/**
 * Summary item.
 *
 * @param props Component properties.
 * @returns Summary item.
 */
function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps): React.JSX.Element {

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
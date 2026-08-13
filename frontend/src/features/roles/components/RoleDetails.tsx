/**
 * Role details component.
 *
 * Displays detailed information
 * about a role.
 */

import {
  Calendar,
} from "lucide-react";



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
   * System role.
   */
  readonly isSystem: boolean;



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
  isSystem,
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

/**
 * Role summary component.
 *
 * Displays a summary of a role.
 */

import {
  Calendar,
  ShieldCheck,
} from "lucide-react";



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
   * System role indicator.
   */
  readonly isSystem: boolean;



  /**
   * Created date.
   */
  readonly createdAt: string | Date;



  /**
   * Updated date.
   */
  readonly updatedAt: string | Date;

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
  isSystem,
  createdAt,
  updatedAt,
}: RoleSummaryProps): React.JSX.Element {


  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(
          createdAt,
        );

  const updated =
    updatedAt instanceof Date
      ? updatedAt
      : new Date(
          updatedAt,
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



            {
              isSystem ? (

                <span

                  className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"

                >

                  System Role

                </span>

              ) : (

                <span

                  className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"

                >

                  Custom Role

                </span>

              )
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

        className="mt-8 grid gap-6 md:grid-cols-3"

      >

        <SummaryItem

          icon={
            <ShieldCheck
              size={18}
              className="text-blue-600"
            />
          }

          label="Type"

          value={
            isSystem ? "System" : "Custom"
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



        <SummaryItem

          icon={
            <Calendar
              size={18}
              className="text-orange-600"
            />
          }

          label="Updated"

          value={
            updated.toLocaleDateString()
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

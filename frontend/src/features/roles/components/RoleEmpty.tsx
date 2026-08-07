/**
 * Role empty component.
 *
 * Displays an empty state when
 * no roles are available.
 */

import {
  Plus,
  Shield,
} from "lucide-react";



/**
 * Component properties.
 */
export interface RoleEmptyProps {


  /**
   * Empty state title.
   */
  readonly title?: string;



  /**
   * Empty state description.
   */
  readonly description?: string;



  /**
   * Action label.
   */
  readonly actionLabel?: string;



  /**
   * Action callback.
   */
  readonly onAction?: () => void;

}



/**
 * Role empty component.
 *
 * @param props Component properties.
 * @returns Role empty component.
 */
export function RoleEmpty({
  title = "No Roles Found",
  description =
    "Create your first role to manage permissions and access control.",
  actionLabel = "Create Role",
  onAction,
}: RoleEmptyProps): React.JSX.Element {


  return (

    <div

      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center"

    >

      <div

        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600"

      >

        <Shield
          size={32}
        />

      </div>



      <h2

        className="mt-6 text-2xl font-bold text-slate-900"

      >

        {title}

      </h2>



      <p

        className="mt-3 max-w-md text-sm leading-6 text-slate-600"

      >

        {description}

      </p>



      {
        onAction ? (

          <button

            type="button"

            onClick={
              onAction
            }

            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"

          >

            <Plus
              size={18}
            />


            {actionLabel}


          </button>

        ) : null
      }


    </div>

  );

}
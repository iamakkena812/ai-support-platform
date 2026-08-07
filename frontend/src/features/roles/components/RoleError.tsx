/**
 * Role error component.
 *
 * Displays an error state when
 * role data cannot be loaded.
 */

import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";



/**
 * Component properties.
 */
export interface RoleErrorProps {


  /**
   * Error object.
   */
  readonly error?: Error | null;



  /**
   * Retry callback.
   */
  readonly onRetry?: () => void;

}



/**
 * Role error component.
 *
 * @param props Component properties.
 * @returns Role error component.
 */
export function RoleError({
  error,
  onRetry,
}: RoleErrorProps): React.JSX.Element {


  return (

    <div

      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"

    >

      <div

        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600"

      >

        <AlertTriangle
          size={32}
        />

      </div>



      <h2

        className="mt-6 text-2xl font-bold text-red-700"

      >

        Unable to Load Roles

      </h2>



      <p

        className="mt-3 max-w-md text-sm text-red-600"

      >

        {
          error?.message ??
          "An unexpected error occurred while loading role data."
        }

      </p>



      {
        onRetry ? (

          <button

            type="button"

            onClick={
              onRetry
            }

            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"

          >

            <RotateCcw
              size={18}
            />


            Retry


          </button>

        ) : null
      }


    </div>

  );

}
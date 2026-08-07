/**
 * Role header component.
 *
 * Displays the role page header
 * with title, description, and actions.
 */

import type {
  ReactNode,
} from "react";

import {
  Shield,
} from "lucide-react";



/**
 * Component properties.
 */
export interface RoleHeaderProps {


  /**
   * Page title.
   */
  readonly title?: string;



  /**
   * Page description.
   */
  readonly description?: string;



  /**
   * Header actions.
   */
  readonly actions?: ReactNode;

}



/**
 * Role header component.
 *
 * @param props Component properties.
 * @returns Role header component.
 */
export function RoleHeader({
  title = "Roles",
  description = 
    "Manage roles, permissions, and access control across the Enterprise AI Support Platform.",
  actions,
}: RoleHeaderProps): React.JSX.Element {

  return (

    <div
      className="flex items-center justify-between"
    >

      <div
        className="flex items-start gap-4"
      >

        <div

          className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white"

        >

          <Shield
            size={24}
          />

        </div>


        <div>

          <h1

            className="text-3xl font-bold text-slate-900"

          >

            {title}

          </h1>


          <p

            className="mt-2 text-sm text-slate-600"

          >

            {description}

          </p>

        </div>


      </div>



      {
        actions ? (

          <div>

            {actions}

          </div>

        ) : null
      }


    </div>

  );

}
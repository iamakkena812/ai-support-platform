/**
 * Role status badge component.
 *
 * Displays role status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  Archive,
  XCircle,
} from "lucide-react";


/**
 * Role status.
 */
export type RoleBadgeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED";



/**
 * Component properties.
 */
export interface RoleStatusBadgeProps {


  /**
   * Role status.
   */
  readonly status: string;

}



/**
 * Returns badge configuration.
 *
 * @param status Role status.
 * @returns Badge configuration.
 */
function getStatusConfig(
  status: string,
): {
  readonly label: string;
  readonly className: string;
  readonly icon: React.JSX.Element;
} {

  switch (
    status.toUpperCase()
  ) {

    case "ACTIVE":

      return {

        label:
          "Active",

        className:
          "border-green-200 bg-green-100 text-green-700",

        icon:
          (
            <CheckCircle2
              size={16}
            />
          ),

      };



    case "INACTIVE":

      return {

        label:
          "Inactive",

        className:
          "border-slate-200 bg-slate-100 text-slate-700",

        icon:
          (
            <XCircle
              size={16}
            />
          ),

      };



    case "ARCHIVED":

      return {

        label:
          "Archived",

        className:
          "border-indigo-200 bg-indigo-100 text-indigo-700",

        icon:
          (
            <Archive
              size={16}
            />
          ),

      };



    default:

      return {

        label:
          status,

        className:
          "border-yellow-200 bg-yellow-100 text-yellow-700",

        icon:
          (
            <Clock3
              size={16}
            />
          ),

      };

  }

}



/**
 * Role status badge.
 *
 * @param props Component properties.
 * @returns Role status badge.
 */
export function RoleStatusBadge({
  status,
}: RoleStatusBadgeProps): React.JSX.Element {

  const config =
    getStatusConfig(
      status,
    );


  return (

    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        config.className,
      ].join(" ")}
    >

      {config.icon}

      {config.label}

    </span>

  );

}
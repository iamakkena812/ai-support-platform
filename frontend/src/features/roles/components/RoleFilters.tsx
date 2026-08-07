/**
 * Role filters component.
 *
 * Displays search and filter controls
 * for the roles list.
 */

import {
  Search,
  Shield,
} from "lucide-react";

import {
  Input,
  Select,
} from "../../../components/ui";



/**
 * Filter option.
 */
export interface RoleFilterOption {


  /**
   * Option label.
   */
  readonly label: string;



  /**
   * Option value.
   */
  readonly value: string;

}



/**
 * Component properties.
 */
export interface RoleFiltersProps {


  /**
   * Search value.
   */
  readonly search: string;



  /**
   * Status filter.
   */
  readonly status: string;



  /**
   * System role filter.
   */
  readonly systemRole: string;



  /**
   * Status options.
   */
  readonly statuses: readonly RoleFilterOption[];



  /**
   * Search callback.
   */
  readonly onSearchChange: (
    value: string,
  ) => void;



  /**
   * Status callback.
   */
  readonly onStatusChange: (
    value: string,
  ) => void;



  /**
   * System role callback.
   */
  readonly onSystemRoleChange: (
    value: string,
  ) => void;

}



/**
 * Default system role options.
 */
const SYSTEM_ROLE_OPTIONS:
readonly RoleFilterOption[] = [

  {
    label:
      "All Roles",

    value:
      "",
  },


  {
    label:
      "System Roles",

    value:
      "SYSTEM",
  },


  {
    label:
      "Custom Roles",

    value:
      "CUSTOM",
  },

];



/**
 * Default status options.
 */
const STATUS_OPTIONS:
readonly RoleFilterOption[] = [

  {
    label:
      "All Statuses",

    value:
      "",
  },


  {
    label:
      "Active",

    value:
      "ACTIVE",
  },


  {
    label:
      "Inactive",

    value:
      "INACTIVE",
  },


  {
    label:
      "Archived",

    value:
      "ARCHIVED",
  },

];



/**
 * Role filters component.
 *
 * @param props Component properties.
 * @returns Role filters component.
 */
export function RoleFilters({
  search,
  status,
  systemRole,
  statuses = STATUS_OPTIONS,
  onSearchChange,
  onStatusChange,
  onSystemRoleChange,
}: RoleFiltersProps): React.JSX.Element {


  return (

    <div

      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

    >

      <div

        className="mb-5 flex items-center gap-3"

      >

        <Shield
          size={20}
          className="text-blue-600"
        />


        <h2

          className="font-semibold text-slate-900"

        >

          Filters

        </h2>


      </div>



      <div

        className="grid gap-4 md:grid-cols-3"

      >

        <div
          className="relative"
        >

          <Search

            size={18}

            className="absolute left-3 top-3 text-slate-400"

          />


          <Input

            placeholder="Search roles..."

            value={
              search
            }

            onChange={
              (
                event,
              ) =>
                onSearchChange(
                  event.target.value,
                )
            }

            className="pl-10"

          />

        </div>



        <Select

          value={
            status
          }

          options={
            statuses
          }

          placeholder="All Statuses"

          onChange={
            (
              event,
            ) =>
              onStatusChange(
                event.target.value,
              )
          }

        />



        <Select

          value={
            systemRole
          }

          options={
            SYSTEM_ROLE_OPTIONS
          }

          placeholder="All Roles"

          onChange={
            (
              event,
            ) =>
              onSystemRoleChange(
                event.target.value,
              )
          }

        />


      </div>


    </div>

  );

}
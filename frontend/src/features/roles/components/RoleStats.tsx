/**
 * Role statistics component.
 *
 * Displays role-related statistics. Field names mirror
 * backend/app/roles/schemas.py RoleStatistics exactly.
 */

import {
  KeyRound,
  Shield,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import {
  DashboardGrid,
  StatCard,
} from "../../dashboard/components";



/**
 * Component properties.
 */
export interface RoleStatsProps {

  /**
   * Total roles.
   */
  readonly total: number;

  /**
   * System-defined roles.
   */
  readonly system: number;

  /**
   * Custom (non-system) roles.
   */
  readonly custom: number;

  /**
   * Roles with at least one permission assigned.
   */
  readonly assigned: number;

  /**
   * Roles with no permissions assigned.
   */
  readonly unassigned: number;

}



/**
 * Role statistics component.
 *
 * @param props Component properties.
 * @returns Role statistics component.
 */
export function RoleStats({
  total,
  system,
  custom,
  assigned,
  unassigned,
}: RoleStatsProps): React.JSX.Element {


  return (

    <DashboardGrid>


      <StatCard

        title="Total Roles"

        value={
          total
        }

        icon={

          <Shield
            size={20}
          />

        }

      />



      <StatCard

        title="System Roles"

        value={
          system
        }

        icon={

          <ShieldCheck
            size={20}
          />

        }

      />



      <StatCard

        title="Custom Roles"

        value={
          custom
        }

        icon={

          <UserCog
            size={20}
          />

        }

      />



      <StatCard

        title="With Permissions"

        value={
          assigned
        }

        icon={

          <KeyRound
            size={20}
          />

        }

      />



      <StatCard

        title="Without Permissions"

        value={
          unassigned
        }

        icon={

          <KeyRound
            size={20}
          />

        }

      />


    </DashboardGrid>

  );

}

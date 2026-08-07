/**
 * Role statistics component.
 *
 * Displays role-related statistics.
 */

import {
  KeyRound,
  Shield,
  ShieldCheck,
  Users,
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
  readonly totalRoles: number;



  /**
   * Active roles.
   */
  readonly activeRoles: number;



  /**
   * Inactive roles.
   */
  readonly inactiveRoles: number;



  /**
   * System roles.
   */
  readonly systemRoles: number;



  /**
   * Total permissions.
   */
  readonly totalPermissions: number;



  /**
   * Assigned users.
   */
  readonly assignedUsers: number;

}



/**
 * Role statistics component.
 *
 * @param props Component properties.
 * @returns Role statistics component.
 */
export function RoleStats({
  totalRoles,
  activeRoles,
  inactiveRoles,
  systemRoles,
  totalPermissions,
  assignedUsers,
}: RoleStatsProps): React.JSX.Element {


  return (

    <DashboardGrid>


      <StatCard

        title="Total Roles"

        value={
          totalRoles
        }

        icon={

          <Shield
            size={20}
          />

        }

      />



      <StatCard

        title="Active Roles"

        value={
          activeRoles
        }

        icon={

          <ShieldCheck
            size={20}
          />

        }

      />



      <StatCard

        title="Inactive Roles"

        value={
          inactiveRoles
        }

        icon={

          <UserCog
            size={20}
          />

        }

      />



      <StatCard

        title="System Roles"

        value={
          systemRoles
        }

        icon={

          <Shield
            size={20}
          />

        }

      />



      <StatCard

        title="Permissions"

        value={
          totalPermissions
        }

        icon={

          <KeyRound
            size={20}
          />

        }

      />



      <StatCard

        title="Assigned Users"

        value={
          assignedUsers
        }

        icon={

          <Users
            size={20}
          />

        }

      />


    </DashboardGrid>

  );

}
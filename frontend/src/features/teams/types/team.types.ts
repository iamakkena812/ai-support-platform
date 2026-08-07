/**
 * Team domain types.
 *
 * Defines TypeScript models used throughout
 * the Teams feature.
 */


/**
 * Team status.
 */
export type TeamStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "ARCHIVED"
  | "SUSPENDED";


/**
 * Team member role.
 */
export type TeamMemberRole =
  | "OWNER"
  | "LEAD"
  | "ADMIN"
  | "MEMBER";


/**
 * Organization reference.
 */
export interface TeamOrganization {

  /**
   * Organization identifier.
   */
  readonly id: string;


  /**
   * Organization name.
   */
  readonly name: string;

}


/**
 * User reference.
 */
export interface TeamUser {

  /**
   * User identifier.
   */
  readonly id: string;


  /**
   * User full name.
   */
  readonly name: string;


  /**
   * User email.
   */
  readonly email: string;


  /**
   * Avatar URL.
   */
  readonly avatarUrl?: string | null;

}


/**
 * Project reference.
 */
export interface TeamProject {

  /**
   * Project identifier.
   */
  readonly id: string;


  /**
   * Project name.
   */
  readonly name: string;


  /**
   * Project description.
   */
  readonly description?: string | null;


  /**
   * Project status.
   */
  readonly status?: string;

}


/**
 * Team member.
 */
export interface TeamMember {

  /**
   * Member identifier.
   */
  readonly id: string;


  /**
   * User information.
   */
  readonly user: TeamUser;


  /**
   * Member role.
   */
  readonly role: TeamMemberRole;


  /**
   * Joined timestamp.
   */
  readonly joinedAt?: string | null;

}


/**
 * Team entity.
 */
export interface Team {

  /**
   * Team identifier.
   */
  readonly id: string;


  /**
   * Team name.
   */
  readonly name: string;


  /**
   * Team description.
   */
  readonly description?: string | null;


  /**
   * Team status.
   */
  readonly status: TeamStatus;


  /**
   * Organization.
   */
  readonly organization?: TeamOrganization | null;


  /**
   * Team leader.
   */
  readonly leader?: TeamUser | null;


  /**
   * Members.
   */
  readonly members: readonly TeamMember[];


  /**
   * Projects.
   */
  readonly projects: readonly TeamProject[];


  /**
   * Created timestamp.
   */
  readonly createdAt: string;


  /**
   * Updated timestamp.
   */
  readonly updatedAt: string;

}



/**
 * Create team request.
 */
export interface CreateTeamRequest {

  /**
   * Organization identifier.
   */
  readonly organizationId: string;


  /**
   * Team name.
   */
  readonly name: string;


  /**
   * Description.
   */
  readonly description?: string | null;


  /**
   * Team status.
   */
  readonly status?: TeamStatus;


  /**
   * Leader identifier.
   */
  readonly leaderId?: string;


  /**
   * Member identifiers.
   */
  readonly memberIds?: readonly string[];

}



/**
 * Update team request.
 */
export interface UpdateTeamRequest {

  /**
   * Team name.
   */
  readonly name?: string;


  /**
   * Description.
   */
  readonly description?: string | null;


  /**
   * Team status.
   */
  readonly status?: TeamStatus;


  /**
   * Leader identifier.
   */
  readonly leaderId?: string;


  /**
   * Member identifiers.
   */
  readonly memberIds?: readonly string[];

}



/**
 * Team filters.
 */
export interface TeamFilterValues {

  /**
   * Search text.
   */
  readonly search?: string;


  /**
   * Organization identifier.
   */
  readonly organizationId?: string;


  /**
   * Status filter.
   */
  readonly status?: TeamStatus;

}



/**
 * Team list query.
 */
export interface TeamListQuery {

  /**
   * Page number.
   */
  readonly page?: number;


  /**
   * Page size.
   */
  readonly pageSize?: number;


  /**
   * Filters.
   */
  readonly filters?: TeamFilterValues;

}



/**
 * Paginated team response.
 */
export interface TeamListResponse {

  /**
   * Teams.
   */
  readonly items: readonly Team[];


  /**
   * Total records.
   */
  readonly total: number;


  /**
   * Current page.
   */
  readonly page: number;


  /**
   * Page size.
   */
  readonly pageSize: number;


  /**
   * Total pages.
   */
  readonly totalPages: number;

}



/**
 * Team statistics.
 */
export interface TeamStatistics {

  /**
   * Total teams.
   */
  readonly total: number;


  /**
   * Active teams.
   */
  readonly active: number;


  /**
   * Inactive teams.
   */
  readonly inactive: number;


  /**
   * Archived teams.
   */
  readonly archived: number;


  /**
   * Total members.
   */
  readonly totalMembers?: number;


  /**
   * Assigned projects.
   */
  readonly assignedProjects?: number;

}
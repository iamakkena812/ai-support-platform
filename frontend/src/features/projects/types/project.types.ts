/**
 * Project domain types.
 *
 * Defines the TypeScript models used throughout the
 * Projects feature.
 */


/**
 * Project status.
 */
export type ProjectStatus =
  | "active"
  | "inactive"
  | "archived"
  | "completed";


/**
 * Project priority.
 */
export type ProjectPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";


/**
 * Team reference.
 */
export interface ProjectTeam {

  /**
   * Team identifier.
   */
  readonly id: string;


  /**
   * Team name.
   */
  readonly name: string;
}


/**
 * User reference.
 */
export interface ProjectUser {

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
}


/**
 * Organization reference.
 */
export interface ProjectOrganization {

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
 * Project entity.
 */
export interface Project {

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
  readonly status: ProjectStatus;


  /**
   * Project priority.
   */
  readonly priority: ProjectPriority;


  /**
   * Organization.
   */
  readonly organization?: ProjectOrganization | null;


  /**
   * Assigned teams.
   */
  readonly teams: readonly ProjectTeam[];


  /**
   * Project members.
   */
  readonly members: readonly ProjectUser[];


  /**
   * Project owner.
   */
  readonly owner?: ProjectUser | null;


  /**
   * Start date.
   */
  readonly startDate?: string | null;


  /**
   * End date.
   */
  readonly endDate?: string | null;


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
 * Create project request.
 */
export interface CreateProjectRequest {

  /**
   * Organization identifier.
   */
  readonly organizationId: string;


  /**
   * Project name.
   */
  readonly name: string;


  /**
   * Description.
   */
  readonly description?: string | null;


  /**
   * Project priority.
   */
  readonly priority: ProjectPriority;


  /**
   * Team identifiers.
   */
  readonly teamIds?: readonly string[];


  /**
   * Member identifiers.
   */
  readonly memberIds?: readonly string[];


  /**
   * Start date.
   */
  readonly startDate?: string | null;


  /**
   * End date.
   */
  readonly endDate?: string | null;
}


/**
 * Update project request.
 */
export interface UpdateProjectRequest {

  /**
   * Project name.
   */
  readonly name?: string;


  /**
   * Description.
   */
  readonly description?: string | null;


  /**
   * Project status.
   */
  readonly status?: ProjectStatus;


  /**
   * Project priority.
   */
  readonly priority?: ProjectPriority;


  /**
   * Team identifiers.
   */
  readonly teamIds?: readonly string[];


  /**
   * Member identifiers.
   */
  readonly memberIds?: readonly string[];


  /**
   * Start date.
   */
  readonly startDate?: string | null;


  /**
   * End date.
   */
  readonly endDate?: string | null;
}


/**
 * Project filter values.
 */
export interface ProjectFilterValues {

  /**
   * Search value.
   */
  readonly search?: string;


  /**
   * Status filter.
   */
  readonly status?: ProjectStatus;


  /**
   * Priority filter.
   */
  readonly priority?: ProjectPriority;


  /**
   * Organization identifier.
   */
  readonly organizationId?: string;
}


/**
 * Project sorting direction.
 */
export type SortDirection =
  | "asc"
  | "desc";


/**
 * Project sorting.
 */
export interface ProjectSort {

  /**
   * Sort field.
   */
  readonly field: keyof Project;


  /**
   * Sort direction.
   */
  readonly direction: SortDirection;
}


/**
 * Project list query.
 */
export interface ProjectListQuery {

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
  readonly filters?: ProjectFilterValues;


  /**
   * Sorting.
   */
  readonly sort?: ProjectSort;
}


/**
 * Paginated project response.
 */
export interface ProjectListResponse {

  /**
   * Returned projects.
   */
  readonly items: readonly Project[];


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
 * Single project response.
 */
export interface ProjectResponse {

  /**
   * Project entity.
   */
  readonly project: Project;
}


/**
 * Project statistics.
 */
export interface ProjectStatistics {

  /**
   * Total projects.
   */
  readonly total: number;


  /**
   * Active projects.
   */
  readonly active: number;


  /**
   * Completed projects.
   */
  readonly completed: number;


  /**
   * Archived projects.
   */
  readonly archived: number;
}
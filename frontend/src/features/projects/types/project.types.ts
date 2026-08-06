/**
 * Project domain types.
 */

/**
 * Project status.
 */
export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

/**
 * Project.
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
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Customer identifier.
   */
  readonly customerId: string;

  /**
   * Project owner identifier.
   */
  readonly ownerId?: string | null;

  /**
   * Project status.
   */
  readonly status: ProjectStatus;

  /**
   * Project start date.
   */
  readonly startDate?: string | null;

  /**
   * Project end date.
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
   * Project name.
   */
  readonly name: string;

  /**
   * Project description.
   */
  readonly description?: string | null;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Customer identifier.
   */
  readonly customerId: string;

  /**
   * Project owner identifier.
   */
  readonly ownerId?: string | null;

  /**
   * Project status.
   */
  readonly status: ProjectStatus;

  /**
   * Project start date.
   */
  readonly startDate?: string | null;

  /**
   * Project end date.
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
   * Project description.
   */
  readonly description?: string | null;

  /**
   * Customer identifier.
   */
  readonly customerId?: string;

  /**
   * Project owner identifier.
   */
  readonly ownerId?: string | null;

  /**
   * Project status.
   */
  readonly status?: ProjectStatus;

  /**
   * Project start date.
   */
  readonly startDate?: string | null;

  /**
   * Project end date.
   */
  readonly endDate?: string | null;
}

/**
 * Project list response.
 */
export interface ProjectListResponse {
  /**
   * Projects.
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
  readonly size: number;
}

/**
 * Project response.
 */
export interface ProjectResponse {
  /**
   * Project.
   */
  readonly project: Project;
}
/**
 * Teams feature exports.
 */

// ====================
// Pages
// ====================

export { TeamsPage } from "./pages/TeamsPage";
export { TeamDetailsPage } from "./pages/TeamDetailsPage";
export { CreateTeamPage } from "./pages/CreateTeamPage";
export { EditTeamPage } from "./pages/EditTeamPage";

// ====================
// Components
// ====================

export { TeamCard } from "./components/TeamCard";
export { TeamTable } from "./components/TeamTable";
export { TeamForm } from "./components/TeamForm";
export { TeamFilters } from "./components/TeamFilters";
export { DeleteTeamDialog } from "./components/DeleteTeamDialog";

// ====================
// Hooks
// ====================

export { useTeam } from "./hooks/useTeam";
export { useTeams } from "./hooks/useTeams";

// ====================
// Services
// ====================

export { TeamService } from "./services/team.service";

// ====================
// API
// ====================

export { TeamApi } from "./api/team.api";

// ====================
// Schemas
// ====================

export {
  teamSchema,
  createTeamSchema,
  updateTeamSchema,
  teamResponseSchema,
  teamListResponseSchema,
} from "./schemas/team.schema";

// ====================
// Types
// ====================

export type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamResponse,
  TeamListResponse,
} from "./types/team.types";
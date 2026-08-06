/**
 * Organizations feature exports.
 */

// ====================
// Pages
// ====================

export { OrganizationsPage } from "./pages/OrganizationsPage";
export { OrganizationDetailsPage } from "./pages/OrganizationDetailsPage";
export { CreateOrganizationPage } from "./pages/CreateOrganizationPage";
export { EditOrganizationPage } from "./pages/EditOrganizationPage";

// ====================
// Components
// ====================

export { OrganizationCard } from "./components/OrganizationCard";
export { OrganizationTable } from "./components/OrganizationTable";
export { OrganizationForm } from "./components/OrganizationForm";
export { OrganizationFilters } from "./components/OrganizationFilters";
export { DeleteOrganizationDialog } from "./components/DeleteOrganizationDialog";

// ====================
// Hooks
// ====================

export { useOrganization } from "./hooks/useOrganization";
export { useOrganizations } from "./hooks/useOrganizations";

// ====================
// Services
// ====================

export { OrganizationService } from "./services/organization.service";

// ====================
// API
// ====================

export { OrganizationApi } from "./api/organization.api";

// ====================
// Schemas
// ====================

export {
  organizationSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationResponseSchema,
  organizationListResponseSchema,
} from "./schemas/organization.schema";

// ====================
// Types
// ====================

export type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationResponse,
  OrganizationListResponse,
} from "./types/organization.types";
/**
 * Lazy-loaded application routes.
 *
 * Centralizes all lazy route imports.
 */

import { lazy } from "react";

/**
 * Authentication pages.
 */
export const LoginPage = lazy(
  async () => {
    const module = await import(
      "../../auth/pages/LoginPage"
    );

    return {
      default: module.LoginPage,
    };
  },
);

export const ForgotPasswordPage = lazy(
  async () => ({
    default: () => (
      <div>
        Forgot Password - Coming Soon
      </div>
    ),
  }),
);

export const ResetPasswordPage = lazy(
  async () => ({
    default: () => (
      <div>
        Reset Password - Coming Soon
      </div>
    ),
  }),
);

/**
 * Dashboard.
 */
export const DashboardPage = lazy(
  async () => {
    const module = await import(
      "../../features/dashboard/pages/DashboardPage"
    );

    return {
      default: module.DashboardPage,
    };
  },
);

/**
 * Customers pages.
 */
export const CustomersPage = lazy(
  async () => {
    const module = await import(
      "../../features/customers/pages/CustomersPage"
    );

    return {
      default: module.CustomersPage,
    };
  },
);

export const CustomerDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/customers/pages/CustomerDetailsPage"
    );

    return {
      default: module.CustomerDetailsPage,
    };
  },
);

export const CreateCustomerPage = lazy(
  async () => {
    const module = await import(
      "../../features/customers/pages/CreateCustomerPage"
    );

    return {
      default: module.CreateCustomerPage,
    };
  },
);

export const EditCustomerPage = lazy(
  async () => {
    const module = await import(
      "../../features/customers/pages/EditCustomerPage"
    );

    return {
      default: module.EditCustomerPage,
    };
  },
);

/**
 * Tickets pages.
 */
export const TicketsPage = lazy(
  async () => {
    const module = await import(
      "../../features/tickets/pages/TicketsPage"
    );

    return {
      default: module.TicketsPage,
    };
  },
);

export const TicketDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/tickets/pages/TicketDetailsPage"
    );

    return {
      default: module.TicketDetailsPage,
    };
  },
);

export const CreateTicketPage = lazy(
  async () => {
    const module = await import(
      "../../features/tickets/pages/CreateTicketPage"
    );

    return {
      default: module.CreateTicketPage,
    };
  },
);

export const EditTicketPage = lazy(
  async () => {
    const module = await import(
      "../../features/tickets/pages/EditTicketPage"
    );

    return {
      default: module.EditTicketPage,
    };
  },
);

/**
 * Comments pages.
 */
export const CommentsPage = lazy(
  async () => {
    const module = await import(
      "../../features/comments/pages/CommentsPage"
    );

    return {
      default: module.CommentsPage,
    };
  },
);

export const CommentDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/comments/pages/CommentDetailsPage"
    );

    return {
      default: module.CommentDetailsPage,
    };
  },
);

export const CreateCommentPage = lazy(
  async () => {
    const module = await import(
      "../../features/comments/pages/CreateCommentPage"
    );

    return {
      default: module.CreateCommentPage,
    };
  },
);

export const EditCommentPage = lazy(
  async () => {
    const module = await import(
      "../../features/comments/pages/EditCommentPage"
    );

    return {
      default: module.EditCommentPage,
    };
  },
);

/**
 * Notifications pages.
 */
export const NotificationsPage = lazy(
  async () => {
    const module = await import(
      "../../features/notifications/pages/NotificationsPage"
    );

    return {
      default: module.NotificationsPage,
    };
  },
);

export const CreateNotificationPage = lazy(
  async () => {
    const module = await import(
      "../../features/notifications/pages/CreateNotificationPage"
    );

    return {
      default: module.CreateNotificationPage,
    };
  },
);

export const NotificationDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/notifications/pages/NotificationDetailsPage"
    );

    return {
      default: module.NotificationDetailsPage,
    };
  },
);

export const EditNotificationPage = lazy(
  async () => {
    const module = await import(
      "../../features/notifications/pages/EditNotificationPage"
    );

    return {
      default: module.EditNotificationPage,
    };
  },
);

/**
 * Attachments pages.
 */
export const AttachmentsPage = lazy(
  async () => {
    const module = await import(
      "../../features/attachments/pages/AttachmentsPage"
    );

    return {
      default: module.AttachmentsPage,
    };
  },
);

export const CreateAttachmentPage = lazy(
  async () => {
    const module = await import(
      "../../features/attachments/pages/CreateAttachmentPage"
    );

    return {
      default: module.CreateAttachmentPage,
    };
  },
);

export const EditAttachmentPage = lazy(
  async () => {
    const module = await import(
      "../../features/attachments/pages/EditAttachmentPage"
    );

    return {
      default: module.EditAttachmentPage,
    };
  },
);

export const AttachmentDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/attachments/pages/AttachmentDetailsPage"
    );

    return {
      default: module.AttachmentDetailsPage,
    };
  },
);

/**
 * Organizations pages.
 */
export const OrganizationsPage = lazy(
  async () => {
    const module = await import(
      "../../features/organizations/pages/OrganizationsPage"
    );

    return {
      default: module.OrganizationsPage,
    };
  },
);

export const CreateOrganizationPage = lazy(
  async () => {
    const module = await import(
      "../../features/organizations/pages/CreateOrganizationPage"
    );

    return {
      default: module.CreateOrganizationPage,
    };
  },
);

export const OrganizationDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/organizations/pages/OrganizationDetailsPage"
    );

    return {
      default: module.OrganizationDetailsPage,
    };
  },
);

export const EditOrganizationPage = lazy(
  async () => {
    const module = await import(
      "../../features/organizations/pages/EditOrganizationPage"
    );

    return {
      default: module.EditOrganizationPage,
    };
  },
);

/**
 * Users pages.
 */
export const UsersPage = lazy(
  async () => {
    const module = await import(
      "../../features/users/pages/UsersPage"
    );

    return {
      default: module.UsersPage,
    };
  },
);

export const UserDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/users/pages/UserDetailsPage"
    );

    return {
      default: module.UserDetailsPage,
    };
  },
);

export const CreateUserPage = lazy(
  async () => {
    const module = await import(
      "../../features/users/pages/CreateUserPage"
    );

    return {
      default: module.CreateUserPage,
    };
  },
);

export const EditUserPage = lazy(
  async () => {
    const module = await import(
      "../../features/users/pages/EditUserPage"
    );

    return {
      default: module.EditUserPage,
    };
  },
);

/**
 * Projects pages.
 */
export const ProjectsPage = lazy(
  async () => {
    const module = await import(
      "../../features/projects/pages/ProjectsPage"
    );

    return {
      default: module.ProjectsPage,
    };
  },
);

export const CreateProjectPage = lazy(
  async () => {
    const module = await import(
      "../../features/projects/pages/CreateProjectPage"
    );

    return {
      default: module.CreateProjectPage,
    };
  },
);

export const ProjectDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/projects/pages/ProjectDetailsPage"
    );

    return {
      default: module.ProjectDetailsPage,
    };
  },
);

export const EditProjectPage = lazy(
  async () => {
    const module = await import(
      "../../features/projects/pages/EditProjectPage"
    );

    return {
      default: module.EditProjectPage,
    };
  },
);

/**
 * Teams pages.
 */
export const TeamsPage = lazy(
  async () => {
    const module = await import(
      "../../features/teams/pages/TeamsPage"
    );

    return {
      default: module.TeamsPage,
    };
  },
);

export const TeamDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/teams/pages/TeamDetailsPage"
    );

    return {
      default: module.TeamDetailsPage,
    };
  },
);

export const CreateTeamPage = lazy(
  async () => {
    const module = await import(
      "../../features/teams/pages/CreateTeamPage"
    );

    return {
      default: module.CreateTeamPage,
    };
  },
);

export const EditTeamPage = lazy(
  async () => {
    const module = await import(
      "../../features/teams/pages/EditTeamPage"
    );

    return {
      default: module.EditTeamPage,
    };
  },
);

/**
 * Roles pages.
 */
export const RolesPage = lazy(
  async () => {
    const module = await import(
      "../../features/roles/pages/RolesPage"
    );

    return {
      default: module.RolesPage,
    };
  },
);

export const CreateRolePage = lazy(
  async () => {
    const module = await import(
      "../../features/roles/pages/CreateRolePage"
    );

    return {
      default: module.CreateRolePage,
    };
  },
);

export const EditRolePage = lazy(
  async () => {
    const module = await import(
      "../../features/roles/pages/EditRolePage"
    );

    return {
      default: module.EditRolePage,
    };
  },
);

export const RoleDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/roles/pages/RoleDetailsPage"
    );

    return {
      default: module.RoleDetailsPage,
    };
  },
);

/**
 * Permissions pages.
 */
export const PermissionsPage = lazy(
  async () => {
    const module = await import(
      "../../features/permissions/pages/PermissionsPage"
    );

    return {
      default: module.PermissionsPage,
    };
  },
);

export const CreatePermissionPage = lazy(
  async () => {
    const module = await import(
      "../../features/permissions/pages/CreatePermissionPage"
    );

    return {
      default: module.CreatePermissionPage,
    };
  },
);

export const EditPermissionPage = lazy(
  async () => {
    const module = await import(
      "../../features/permissions/pages/EditPermissionPage"
    );

    return {
      default: module.EditPermissionPage,
    };
  },
);

export const PermissionDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/permissions/pages/PermissionDetailsPage"
    );

    return {
      default: module.PermissionDetailsPage,
    };
  },
);

/**
 * AI Assistant pages.
 */
export const AIAssistantPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-assistant/pages/AIAssistantPage"
    );

    return {
      default: module.AIAssistantPage,
    };
  },
);

export const AIConversationPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-assistant/pages/AIConversationPage"
    );

    return {
      default: module.AIConversationPage,
    };
  },
);

/**
 * AI Documents pages.
 */
export const AIDocumentsPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-documents/pages/AIDocumentsPage"
    );

    return {
      default: module.AIDocumentsPage,
    };
  },
);

export const CreateAIDocumentPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-documents/pages/CreateAIDocumentPage"
    );

    return {
      default: module.CreateAIDocumentPage,
    };
  },
);

export const AIDocumentDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-documents/pages/AIDocumentDetailsPage"
    );

    return {
      default: module.AIDocumentDetailsPage,
    };
  },
);

/**
 * AI Knowledge pages.
 */
export const AIKnowledgePage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-knowledge/pages/AIKnowledgePage"
    );

    return {
      default: module.AIKnowledgePage,
    };
  },
);

export const CreateAIKnowledgePage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-knowledge/pages/CreateAIKnowledgePage"
    );

    return {
      default: module.CreateAIKnowledgePage,
    };
  },
);

export const AIKnowledgeDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-knowledge/pages/AIKnowledgeDetailsPage"
    );

    return {
      default: module.AIKnowledgeDetailsPage,
    };
  },
);

export const EditAIKnowledgePage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-knowledge/pages/EditAIKnowledgePage"
    );

    return {
      default: module.EditAIKnowledgePage,
    };
  },
);

/**
 * AI Retrieval pages.
 */
export const AIRetrievalPage = lazy(
  async () => {
    const module = await import(
      "../../features/ai-retrieval/pages/AIRetrievalPage"
    );

    return {
      default: module.AIRetrievalPage,
    };
  },
);

/**
 * Workflows pages.
 */
export const WorkflowsPage = lazy(
  async () => {
    const module = await import(
      "../../features/workflows/pages/WorkflowsPage"
    );

    return {
      default: module.WorkflowsPage,
    };
  },
);

export const CreateWorkflowPage = lazy(
  async () => {
    const module = await import(
      "../../features/workflows/pages/CreateWorkflowPage"
    );

    return {
      default: module.CreateWorkflowPage,
    };
  },
);

export const WorkflowDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/workflows/pages/WorkflowDetailsPage"
    );

    return {
      default: module.WorkflowDetailsPage,
    };
  },
);

/**
 * SLA pages.
 */
export const SLAPoliciesPage = lazy(
  async () => {
    const module = await import(
      "../../features/sla/pages/SLAPoliciesPage"
    );

    return {
      default: module.SLAPoliciesPage,
    };
  },
);

export const CreateSLAPolicyPage = lazy(
  async () => {
    const module = await import(
      "../../features/sla/pages/CreateSLAPolicyPage"
    );

    return {
      default: module.CreateSLAPolicyPage,
    };
  },
);

export const SLAPolicyDetailsPage = lazy(
  async () => {
    const module = await import(
      "../../features/sla/pages/SLAPolicyDetailsPage"
    );

    return {
      default: module.SLAPolicyDetailsPage,
    };
  },
);

/**
 * Analytics pages.
 */
export const AnalyticsPage = lazy(
  async () => {
    const module = await import(
      "../../features/analytics/pages/AnalyticsPage"
    );

    return {
      default: module.AnalyticsPage,
    };
  },
);

/**
 * Settings page.
 */
export const SettingsPage = lazy(
  async () => {
    const module = await import(
      "../../features/settings/pages/SettingsPage"
    );

    return {
      default: module.SettingsPage,
    };
  },
);
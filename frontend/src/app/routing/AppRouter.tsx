/**
 * Application router.
 *
 * Defines public and protected application routes.
 */

import { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AttachmentDetailsPage,
  AttachmentsPage,
  CommentDetailsPage,
  CommentsPage,
  CreateAttachmentPage,
  CreateCommentPage,
  CreateCustomerPage,
  CreateNotificationPage,
  CreateOrganizationPage,
  CreatePermissionPage,
  CreateProjectPage,
  CreateRolePage,
  CreateTeamPage,
  CreateTicketPage,
  CreateUserPage,
  CustomerDetailsPage,
  CustomersPage,
  DashboardPage,
  EditAttachmentPage,
  EditCommentPage,
  EditCustomerPage,
  EditNotificationPage,
  EditOrganizationPage,
  EditPermissionPage,
  EditProjectPage,
  EditRolePage,
  EditTeamPage,
  EditTicketPage,
  EditUserPage,
  ForgotPasswordPage,
  LoginPage,
  NotificationDetailsPage,
  NotificationsPage,
  OrganizationDetailsPage,
  OrganizationsPage,
  PermissionDetailsPage,
  PermissionsPage,
  ProjectDetailsPage,
  ProjectsPage,
  ResetPasswordPage,
  RoleDetailsPage,
  RolesPage,
  SettingsPage,
  TeamDetailsPage,
  TeamsPage,
  TicketDetailsPage,
  TicketsPage,
  UserDetailsPage,
  UsersPage,
} from "./lazy-routes";

import { DashboardLayout } from "../../layouts/app/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "./route-config";

/**
 * Protected application content.
 *
 * Applies authentication protection and the common
 * dashboard layout to every authenticated page.
 *
 * @param children Protected page content.
 * @returns Protected content inside the dashboard layout.
 */
function ProtectedLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

/**
 * Application router.
 *
 * @returns Application routes.
 */
export function AppRouter(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-sm text-slate-500">
            Loading...
          </div>
        </div>
      }
    >
      <Routes>
        {/* =====================================================
            Public Routes
            ===================================================== */}

        <Route
          path={PUBLIC_ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={PUBLIC_ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path={PUBLIC_ROUTES.RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* =====================================================
            Dashboard
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.DASHBOARD}
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Organizations
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.ORGANIZATIONS}
          element={
            <ProtectedLayout>
              <OrganizationsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ORGANIZATIONS}/create`}
          element={
            <ProtectedLayout>
              <CreateOrganizationPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ORGANIZATIONS}/:id`}
          element={
            <ProtectedLayout>
              <OrganizationDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ORGANIZATIONS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditOrganizationPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Customers
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.CUSTOMERS}
          element={
            <ProtectedLayout>
              <CustomersPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.CUSTOMERS}/create`}
          element={
            <ProtectedLayout>
              <CreateCustomerPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.CUSTOMERS}/:id`}
          element={
            <ProtectedLayout>
              <CustomerDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.CUSTOMERS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditCustomerPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Tickets
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.TICKETS}
          element={
            <ProtectedLayout>
              <TicketsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TICKETS}/create`}
          element={
            <ProtectedLayout>
              <CreateTicketPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TICKETS}/:id`}
          element={
            <ProtectedLayout>
              <TicketDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TICKETS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditTicketPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Comments
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.COMMENTS}
          element={
            <ProtectedLayout>
              <CommentsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.COMMENTS}/create`}
          element={
            <ProtectedLayout>
              <CreateCommentPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.COMMENTS}/:id`}
          element={
            <ProtectedLayout>
              <CommentDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.COMMENTS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditCommentPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Notifications
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.NOTIFICATIONS}
          element={
            <ProtectedLayout>
              <NotificationsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.NOTIFICATIONS}/create`}
          element={
            <ProtectedLayout>
              <CreateNotificationPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.NOTIFICATIONS}/:id`}
          element={
            <ProtectedLayout>
              <NotificationDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.NOTIFICATIONS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditNotificationPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Attachments
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.ATTACHMENTS}
          element={
            <ProtectedLayout>
              <AttachmentsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ATTACHMENTS}/create`}
          element={
            <ProtectedLayout>
              <CreateAttachmentPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ATTACHMENTS}/:id`}
          element={
            <ProtectedLayout>
              <AttachmentDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ATTACHMENTS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditAttachmentPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Users
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.USERS}
          element={
            <ProtectedLayout>
              <UsersPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.USERS}/create`}
          element={
            <ProtectedLayout>
              <CreateUserPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.USERS}/:id`}
          element={
            <ProtectedLayout>
              <UserDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.USERS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditUserPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Projects
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.PROJECTS}
          element={
            <ProtectedLayout>
              <ProjectsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PROJECTS}/create`}
          element={
            <ProtectedLayout>
              <CreateProjectPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PROJECTS}/:id`}
          element={
            <ProtectedLayout>
              <ProjectDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PROJECTS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditProjectPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Teams
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.TEAMS}
          element={
            <ProtectedLayout>
              <TeamsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TEAMS}/create`}
          element={
            <ProtectedLayout>
              <CreateTeamPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TEAMS}/:id`}
          element={
            <ProtectedLayout>
              <TeamDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.TEAMS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditTeamPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Roles
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.ROLES}
          element={
            <ProtectedLayout>
              <RolesPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ROLES}/create`}
          element={
            <ProtectedLayout>
              <CreateRolePage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ROLES}/:id`}
          element={
            <ProtectedLayout>
              <RoleDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.ROLES}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditRolePage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Permissions
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.PERMISSIONS}
          element={
            <ProtectedLayout>
              <PermissionsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PERMISSIONS}/create`}
          element={
            <ProtectedLayout>
              <CreatePermissionPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PERMISSIONS}/:id`}
          element={
            <ProtectedLayout>
              <PermissionDetailsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path={`${PROTECTED_ROUTES.PERMISSIONS}/:id/edit`}
          element={
            <ProtectedLayout>
              <EditPermissionPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Settings
            ===================================================== */}

        <Route
          path={PROTECTED_ROUTES.SETTINGS}
          element={
            <ProtectedLayout>
              <SettingsPage />
            </ProtectedLayout>
          }
        />

        {/* =====================================================
            Fallback
            ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              replace
              to={PUBLIC_ROUTES.LOGIN}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}
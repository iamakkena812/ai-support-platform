/**
 * Application router.
 */

import {
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  ProtectedRoute,
} from "./ProtectedRoute";

import {
  PublicRoute,
} from "./PublicRoute";

import {
  DashboardPage,
  CustomersPage,
  CustomerDetailsPage,
  CreateCustomerPage,
  EditCustomerPage,

  TicketsPage,
  TicketDetailsPage,
  CreateTicketPage,
  EditTicketPage,

  CommentsPage,
  CommentDetailsPage,
  CreateCommentPage,
  EditCommentPage,

  NotificationsPage,
  NotificationDetailsPage,
  CreateNotificationPage,
  EditNotificationPage,

  AttachmentsPage,
  AttachmentDetailsPage,
  CreateAttachmentPage,
  EditAttachmentPage,

  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,

  UsersPage,
  CreateUserPage,
  UserDetailsPage,
  EditUserPage,

  ProjectsPage,
  CreateProjectPage,
  ProjectDetailsPage,
  EditProjectPage,

  TeamsPage,
  TeamDetailsPage,
  CreateTeamPage,
  EditTeamPage,

  RolesPage,
  CreateRolePage,
  EditRolePage,
  RoleDetailsPage,

  PermissionsPage,
  CreatePermissionPage,
  EditPermissionPage,
  PermissionDetailsPage,

} from "./lazy-routes";



import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "./route-config";


/**
 * Application router.
 *
 * @returns Application routes.
 */
export function AppRouter(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div>
          Loading...
        </div>
      }
    >

      <Routes>

        {/* Public Routes */}

        <Route
          path={
            PUBLIC_ROUTES.LOGIN
          }
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />


        <Route
          path={
            PUBLIC_ROUTES.FORGOT_PASSWORD
          }
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />


        <Route
          path={
            PUBLIC_ROUTES.RESET_PASSWORD
          }
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />


        {/* Dashboard */}

        <Route
          path={
            PROTECTED_ROUTES.DASHBOARD
          }
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />


        {/* Customers */}

        <Route
          path={
            PROTECTED_ROUTES.CUSTOMERS
          }
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.CUSTOMERS}/create`
          }
          element={
            <ProtectedRoute>
              <CreateCustomerPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.CUSTOMERS}/:id`
          }
          element={
            <ProtectedRoute>
              <CustomerDetailsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.CUSTOMERS}/:id/edit`
          }
          element={
            <ProtectedRoute>
              <EditCustomerPage />
            </ProtectedRoute>
          }
        />


        {/* Tickets */}

        <Route
          path={
            PROTECTED_ROUTES.TICKETS
          }
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.TICKETS}/create`
          }
          element={
            <ProtectedRoute>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.TICKETS}/:id`
          }
          element={
            <ProtectedRoute>
              <TicketDetailsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.TICKETS}/:id/edit`
          }
          element={
            <ProtectedRoute>
              <EditTicketPage />
            </ProtectedRoute>
          }
        />


        {/* Comments */}

        <Route
          path={
            PROTECTED_ROUTES.COMMENTS
          }
          element={
            <ProtectedRoute>
              <CommentsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.COMMENTS}/create`
          }
          element={
            <ProtectedRoute>
              <CreateCommentPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.COMMENTS}/:id`
          }
          element={
            <ProtectedRoute>
              <CommentDetailsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.COMMENTS}/:id/edit`
          }
          element={
            <ProtectedRoute>
              <EditCommentPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}

        <Route
          path={
            PROTECTED_ROUTES.NOTIFICATIONS
          }
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.NOTIFICATIONS}/create`
          }
          element={
            <ProtectedRoute>
              <CreateNotificationPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.NOTIFICATIONS}/:id`
          }
          element={
            <ProtectedRoute>
              <NotificationDetailsPage />
            </ProtectedRoute>
          }
        />


        <Route
          path={
            `${PROTECTED_ROUTES.NOTIFICATIONS}/:id/edit`
          }
          element={
            <ProtectedRoute>
              <EditNotificationPage />
            </ProtectedRoute>
          }
        />

       {/* Attachments */}

          <Route
            path={
              PROTECTED_ROUTES.ATTACHMENTS
            }
            element={
              <ProtectedRoute>
                <AttachmentsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path={
              `${PROTECTED_ROUTES.ATTACHMENTS}/create`
            }
            element={
              <ProtectedRoute>
                <CreateAttachmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={
              `${PROTECTED_ROUTES.ATTACHMENTS}/:id`
            }
            element={
              <ProtectedRoute>
                <AttachmentDetailsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path={
              `${PROTECTED_ROUTES.ATTACHMENTS}/:id/edit`
            }
            element={
              <ProtectedRoute>
                <EditAttachmentPage />
              </ProtectedRoute>
            }
          />     

        {/* Fallback */}

        <Route
          path="*"
          element={
            <Navigate
              replace
              to={
                PUBLIC_ROUTES.LOGIN
              }
            />
          }
        />

         {/* Users Routes */}

        <Route
          path="/users"
          element={
            <UsersPage />
          }
        />


        <Route
          path="/users/create"
          element={
            <CreateUserPage />
          }
        />


        <Route
          path="/users/:id"
          element={
            <UserDetailsPage />
          }
        />


        <Route
          path="/users/:id/edit"
          element={
            <EditUserPage />
          }
        /> 

        <Route
            path="/projects"
            element={
              <ProjectsPage />
            }
          />


          <Route
            path="/projects/create"
            element={
              <CreateProjectPage />
            }
          />


          <Route
            path="/projects/:id"
            element={
              <ProjectDetailsPage />
            }
          />


          <Route
            path="/projects/:id/edit"
            element={
              <EditProjectPage />
            }
          />

          <Route
              path="/teams"
              element={
                <TeamsPage />
              }
            />


            <Route
              path="/teams/create"
              element={
                <CreateTeamPage />
              }
            />


            <Route
              path="/teams/:id"
              element={
                <TeamDetailsPage />
              }
            />


            <Route
              path="/teams/:id/edit"
              element={
                <EditTeamPage />
              }
            />   

          <Route

              path="/roles"

              element={

                <RolesPage />

              }

            />


            <Route

              path="/roles/create"

              element={

                <CreateRolePage />

              }

            />


            <Route

              path="/roles/:id"

              element={

                <RoleDetailsPage />

              }

            />


            <Route

              path="/roles/:id/edit"

              element={

                <EditRolePage />

              }

            />

              {/* Permissions */}
            <Route
              path={PROTECTED_ROUTES.PERMISSIONS}
              element={
                <ProtectedRoute>
                  <PermissionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={`${PROTECTED_ROUTES.PERMISSIONS}/create`}
              element={
                <ProtectedRoute>
                  <CreatePermissionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={`${PROTECTED_ROUTES.PERMISSIONS}/:id`}
              element={
                <ProtectedRoute>
                  <PermissionDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={`${PROTECTED_ROUTES.PERMISSIONS}/:id/edit`}
              element={
                <ProtectedRoute>
                  <EditPermissionPage />
                </ProtectedRoute>
              }
            />

      </Routes>

    </Suspense>
  );
}
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

  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,

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

      </Routes>

    </Suspense>
  );
}
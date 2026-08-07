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
        {/* Public */}

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


        {/* Protected */}

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


        {/* Redirect */}

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
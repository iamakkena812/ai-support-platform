/**
 * Lazy-loaded application routes.
 *
 * Centralizes all lazy route imports.
 */

import {
  lazy,
} from "react";

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
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

export const NotificationsPage =
  lazy(
    () =>
      import(
        "../../features/notifications/pages/NotificationsPage"
      )
      .then(
        (module) => ({
          default:
            module.NotificationsPage,
        }),
      ),
    );


export const CreateNotificationPage =
  lazy(
    () =>
      import(
        "../../features/notifications/pages/CreateNotificationPage"
      )
      .then(
        (module) => ({
          default:
            module.CreateNotificationPage,
        }),
      ),
    );


export const NotificationDetailsPage =
  lazy(
    () =>
      import(
        "../../features/notifications/pages/NotificationDetailsPage"
      )
      .then(
        (module) => ({
          default:
            module.NotificationDetailsPage,
        }),
      ),
    );


export const EditNotificationPage =
  lazy(
    () =>
      import(
        "../../features/notifications/pages/EditNotificationPage"
      )
      .then(
        (module) => ({
          default:
            module.EditNotificationPage,
        }),
      ),
    );

  export const AttachmentsPage =
  lazy(
    () =>
      import(
        "../../features/attachments/pages/AttachmentsPage"
      ).then(
        (module) => ({
          default:
            module.AttachmentsPage,
        }),
      ),
  );


export const CreateAttachmentPage =
  lazy(
    () =>
      import(
        "../../features/attachments/pages/CreateAttachmentPage"
      ).then(
        (module) => ({
          default:
            module.CreateAttachmentPage,
        }),
      ),
  );


export const EditAttachmentPage =
  lazy(
    () =>
      import(
        "../../features/attachments/pages/EditAttachmentPage"
      ).then(
        (module) => ({
          default:
            module.EditAttachmentPage,
        }),
      ),
  );


export const AttachmentDetailsPage =
  lazy(
    () =>
      import(
        "../../features/attachments/pages/AttachmentDetailsPage"
      ).then(
        (module) => ({
          default:
            module.AttachmentDetailsPage,
        }),
      ),
  );

  export const UsersPage =
  lazy(
    () =>
      import(
        "../../features/users/pages/UsersPage"
      ).then(
        (module) => ({
          default:
            module.UsersPage,
        }),
      ),
  );


export const UserDetailsPage =
  lazy(
    () =>
      import(
        "../../features/users/pages/UserDetailsPage"
      ).then(
        (module) => ({
          default:
            module.UserDetailsPage,
        }),
      ),
  );


export const CreateUserPage =
  lazy(
    () =>
      import(
        "../../features/users/pages/CreateUserPage"
      ).then(
        (module) => ({
          default:
            module.CreateUserPage,
        }),
      ),
  );


export const EditUserPage =
  lazy(
    () =>
      import(
        "../../features/users/pages/EditUserPage"
      ).then(
        (module) => ({
          default:
            module.EditUserPage,
        }),
      ),
  );

  /**
 * Projects pages.
 */
export const ProjectsPage =
lazy(
  () =>
    import(
      "../../features/projects/pages/ProjectsPage"
    ).then(
      (module) => ({
        default:
          module.ProjectsPage,
      }),
    ),
);


export const CreateProjectPage =
lazy(
  () =>
    import(
      "../../features/projects/pages/CreateProjectPage"
    ).then(
      (module) => ({
        default:
          module.CreateProjectPage,
      }),
    ),
);


export const ProjectDetailsPage =
lazy(
  () =>
    import(
      "../../features/projects/pages/ProjectDetailsPage"
    ).then(
      (module) => ({
        default:
          module.ProjectDetailsPage,
      }),
    ),
);


export const EditProjectPage =
lazy(
  () =>
    import(
      "../../features/projects/pages/EditProjectPage"
    ).then(
      (module) => ({
        default:
          module.EditProjectPage,
      }),
    ),
);


/**
 * Teams pages.
 */
export const TeamsPage =
lazy(
  () =>
    import(
      "../../features/teams/pages/TeamsPage"
    ).then(
      (module) => ({
        default:
          module.TeamsPage,
      }),
    ),
);


export const TeamDetailsPage =
lazy(
  () =>
    import(
      "../../features/teams/pages/TeamDetailsPage"
    ).then(
      (module) => ({
        default:
          module.TeamDetailsPage,
      }),
    ),
);


export const CreateTeamPage =
lazy(
  () =>
    import(
      "../../features/teams/pages/CreateTeamPage"
    ).then(
      (module) => ({
        default:
          module.CreateTeamPage,
      }),
    ),
);


export const EditTeamPage =
lazy(
  () =>
    import(
      "../../features/teams/pages/EditTeamPage"
    ).then(
      (module) => ({
        default:
          module.EditTeamPage,
      }),
    ),
);


/**
 * Roles pages.
 */
export const RolesPage =
  lazy(
    () =>
      import(
        "../../features/roles/pages/RolesPage"
      ).then(
        (module) => ({
          default:
            module.RolesPage,
        }),
      ),
  );



export const CreateRolePage =
  lazy(
    () =>
      import(
        "../../features/roles/pages/CreateRolePage"
      ).then(
        (module) => ({
          default:
            module.CreateRolePage,
        }),
      ),
  );



export const EditRolePage =
  lazy(
    () =>
      import(
        "../../features/roles/pages/EditRolePage"
      ).then(
        (module) => ({
          default:
            module.EditRolePage,
        }),
      ),
  );



export const RoleDetailsPage =
  lazy(
    () =>
      import(
        "../../features/roles/pages/RoleDetailsPage"
      ).then(
        (module) => ({
          default:
            module.RoleDetailsPage,
        }),
      ),
  );
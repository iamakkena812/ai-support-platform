"""Email templates."""

from __future__ import annotations

from string import Template

from app.email.constants import EmailTemplate


class EmailTemplates:
    """Email template manager."""

    _SUBJECTS: dict[EmailTemplate, Template] = {
        EmailTemplate.GENERIC: Template("$subject"),
        EmailTemplate.WELCOME: Template("Welcome to Enterprise AI Support Platform"),
        EmailTemplate.PASSWORD_RESET: Template("Reset Your Password"),
        EmailTemplate.EMAIL_VERIFICATION: Template("Verify Your Email Address"),
        EmailTemplate.INVITATION: Template("You're Invited"),
        EmailTemplate.TICKET_CREATED: Template("Ticket #$ticket_id Created"),
        EmailTemplate.TICKET_ASSIGNED: Template("Ticket #$ticket_id Assigned"),
        EmailTemplate.TICKET_UPDATED: Template("Ticket #$ticket_id Updated"),
        EmailTemplate.TICKET_RESOLVED: Template("Ticket #$ticket_id Resolved"),
        EmailTemplate.COMMENT_ADDED: Template("New Comment on Ticket #$ticket_id"),
    }

    _BODIES: dict[EmailTemplate, Template] = {
        EmailTemplate.GENERIC: Template("$body"),
        EmailTemplate.WELCOME: Template("""Hello $name,

Welcome to Enterprise AI Support Platform.

We're excited to have you on board.

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.PASSWORD_RESET: Template("""Hello $name,

You requested a password reset.

Use the following link:

$reset_link

If you did not request this change, please ignore this email.

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.EMAIL_VERIFICATION: Template("""Hello $name,

Please verify your email address by visiting:

$verification_link

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.INVITATION: Template("""Hello $name,

You have been invited to join our organization.

Invitation Link:

$invitation_link

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.TICKET_CREATED: Template("""Hello $name,

Your ticket #$ticket_id has been created successfully.

Title:
$title

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.TICKET_ASSIGNED: Template("""Hello $name,

Ticket #$ticket_id has been assigned to you.

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.TICKET_UPDATED: Template("""Hello $name,

Ticket #$ticket_id has been updated.

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.TICKET_RESOLVED: Template("""Hello $name,

Ticket #$ticket_id has been resolved.

Regards,
Enterprise AI Support Team
"""),
        EmailTemplate.COMMENT_ADDED: Template("""Hello $name,

A new comment has been added to ticket #$ticket_id.

Regards,
Enterprise AI Support Team
"""),
    }

    @classmethod
    def render_subject(
        cls,
        template: EmailTemplate,
        **context: str,
    ) -> str:
        """Render an email subject."""
        return cls._SUBJECTS[template].safe_substitute(**context)

    @classmethod
    def render_body(
        cls,
        template: EmailTemplate,
        **context: str,
    ) -> str:
        """Render an email body."""
        return cls._BODIES[template].safe_substitute(**context)

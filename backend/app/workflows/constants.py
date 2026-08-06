"""Constants for the workflow module."""

from __future__ import annotations

from enum import StrEnum

WORKFLOW_PREFIX = "/api/v1/workflows"
WORKFLOW_TAG = "Workflows"


class WorkflowStatus(StrEnum):
    """Workflow status."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"


class WorkflowTrigger(StrEnum):
    """Workflow trigger events."""

    TICKET_CREATED = "ticket_created"
    TICKET_UPDATED = "ticket_updated"
    TICKET_ASSIGNED = "ticket_assigned"
    TICKET_RESOLVED = "ticket_resolved"
    TICKET_CLOSED = "ticket_closed"
    COMMENT_CREATED = "comment_created"
    ATTACHMENT_UPLOADED = "attachment_uploaded"
    SLA_BREACHED = "sla_breached"


class WorkflowCondition(StrEnum):
    """Workflow condition types."""

    STATUS = "status"
    PRIORITY = "priority"
    CATEGORY = "category"
    ASSIGNEE = "assignee"
    TEAM = "team"
    ORGANIZATION = "organization"
    SLA = "sla"
    TAG = "tag"


class WorkflowAction(StrEnum):
    """Workflow action types."""

    ASSIGN_USER = "assign_user"
    ASSIGN_TEAM = "assign_team"
    CHANGE_STATUS = "change_status"
    CHANGE_PRIORITY = "change_priority"
    ADD_TAG = "add_tag"
    REMOVE_TAG = "remove_tag"
    SEND_EMAIL = "send_email"
    SEND_NOTIFICATION = "send_notification"
    START_SLA = "start_sla"
    CREATE_COMMENT = "create_comment"
    CREATE_AUDIT_LOG = "create_audit_log"


class TicketStatus(StrEnum):
    """Allowed ticket workflow states."""

    OPEN = "open"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    PENDING = "pending"
    RESOLVED = "resolved"
    CLOSED = "closed"


DEFAULT_WORKFLOW_NAME = "Default Workflow"

WORKFLOW_NOT_FOUND = "Workflow not found."
WORKFLOW_ALREADY_EXISTS = "Workflow already exists."
INVALID_TRANSITION = "Invalid workflow transition."
INVALID_TRIGGER = "Invalid workflow trigger."
INVALID_ACTION = "Invalid workflow action."
INVALID_CONDITION = "Invalid workflow condition."
WORKFLOW_DISABLED = "Workflow is disabled."

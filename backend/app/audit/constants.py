"""Constants for the audit module."""

from __future__ import annotations

from typing import Final

MODULE_NAME: Final[str] = "audit"

# Pagination
DEFAULT_PAGE: Final[int] = 1
DEFAULT_PAGE_SIZE: Final[int] = 20
MAX_PAGE_SIZE: Final[int] = 100

# Audit Actions
ACTION_CREATE: Final[str] = "create"
ACTION_UPDATE: Final[str] = "update"
ACTION_DELETE: Final[str] = "delete"
ACTION_RESTORE: Final[str] = "restore"
ACTION_LOGIN: Final[str] = "login"
ACTION_LOGOUT: Final[str] = "logout"
ACTION_UPLOAD: Final[str] = "upload"
ACTION_DOWNLOAD: Final[str] = "download"
ACTION_EXPORT: Final[str] = "export"
ACTION_IMPORT: Final[str] = "import"
ACTION_ASSIGN: Final[str] = "assign"
ACTION_COMMENT: Final[str] = "comment"
ACTION_STATUS_CHANGE: Final[str] = "status_change"
ACTION_PASSWORD_RESET: Final[str] = "password_reset"
ACTION_ROLE_CHANGE: Final[str] = "role_change"
ACTION_API_KEY_CREATED: Final[str] = "api_key_created"
ACTION_API_KEY_REVOKED: Final[str] = "api_key_revoked"

# Audit Status
STATUS_SUCCESS: Final[str] = "success"
STATUS_FAILURE: Final[str] = "failure"

# Entity Types
ENTITY_USER: Final[str] = "user"
ENTITY_ORGANIZATION: Final[str] = "organization"
ENTITY_TEAM: Final[str] = "team"
ENTITY_PROJECT: Final[str] = "project"
ENTITY_CUSTOMER: Final[str] = "customer"
ENTITY_TICKET: Final[str] = "ticket"
ENTITY_COMMENT: Final[str] = "comment"
ENTITY_NOTIFICATION: Final[str] = "notification"
ENTITY_FILE: Final[str] = "file"
ENTITY_KNOWLEDGE_BASE: Final[str] = "knowledge_base"
ENTITY_API_KEY: Final[str] = "api_key"

# Request Metadata
MAX_IP_ADDRESS_LENGTH: Final[int] = 45
MAX_USER_AGENT_LENGTH: Final[int] = 512
MAX_REQUEST_ID_LENGTH: Final[int] = 100

# JSON Payload Limits
MAX_CHANGESET_SIZE: Final[int] = 100_000

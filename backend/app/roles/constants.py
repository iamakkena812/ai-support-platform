"""Role management constants."""

from __future__ import annotations

from typing import Final

# ---------------------------------------------------------------------------
# Role fields
# ---------------------------------------------------------------------------

ROLE_NAME_MIN_LENGTH: Final[int] = 1
ROLE_NAME_MAX_LENGTH: Final[int] = 100

ROLE_DESCRIPTION_MAX_LENGTH: Final[int] = 500


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------

DEFAULT_ROLE_PAGE: Final[int] = 1
DEFAULT_ROLE_PAGE_SIZE: Final[int] = 20
MAX_ROLE_PAGE_SIZE: Final[int] = 100


# ---------------------------------------------------------------------------
# System roles
# ---------------------------------------------------------------------------

ROLE_ADMIN: Final[str] = "admin"
ROLE_AGENT: Final[str] = "agent"
ROLE_MANAGER: Final[str] = "manager"
ROLE_VIEWER: Final[str] = "viewer"


# ---------------------------------------------------------------------------
# Role status
# ---------------------------------------------------------------------------

ROLE_ACTIVE: Final[str] = "active"
ROLE_INACTIVE: Final[str] = "inactive"
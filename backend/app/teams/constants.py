"""Team module Constants."""

from __future__ import annotations

from enum import StrEnum

TEAM_NAME_MIN_LENGTH = 2
TEAM_NAME_MAX_LENGTH = 100

TEAM_CODE_MIN_LENGTH = 2
TEAM_CODE_MAX_LENGTH = 50

TEAM_DESCRIPTION_MAX_LENGTH = 500


class TeamStatus(StrEnum):
    """Supported team statuses.

    Values are uppercase to match ``TeamForm``'s ``STATUS_OPTIONS`` --
    the only place in the frontend that actually sends this field.
    """

    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    PENDING = "PENDING"
    ARCHIVED = "ARCHIVED"


DEFAULT_STATUS = TeamStatus.ACTIVE

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

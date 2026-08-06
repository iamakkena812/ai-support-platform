"""Constants for the comments module."""

from __future__ import annotations

from enum import StrEnum
from typing import Final


class CommentVisibility(StrEnum):
    """Comment visibility."""

    PUBLIC = "public"
    INTERNAL = "internal"


DEFAULT_COMMENT_OFFSET: Final[int] = 0
DEFAULT_COMMENT_LIMIT: Final[int] = 20
MAX_COMMENT_LIMIT: Final[int] = 100

MIN_COMMENT_LENGTH: Final[int] = 1
MAX_COMMENT_LENGTH: Final[int] = 10_000

DEFAULT_SORT_BY: Final[str] = "created_at"
DEFAULT_SORT_ORDER: Final[str] = "desc"

COMMENT_CREATE_PERMISSION: Final[str] = "comments:create"
COMMENT_READ_PERMISSION: Final[str] = "comments:read"
COMMENT_UPDATE_PERMISSION: Final[str] = "comments:update"
COMMENT_DELETE_PERMISSION: Final[str] = "comments:delete"

COMMENT_NOT_FOUND_MESSAGE: Final[str] = "Comment not found."
COMMENT_ALREADY_DELETED_MESSAGE: Final[str] = "Comment has already been deleted."
INVALID_COMMENT_VISIBILITY_MESSAGE: Final[str] = "Invalid comment visibility."

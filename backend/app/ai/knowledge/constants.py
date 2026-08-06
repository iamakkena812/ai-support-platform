"""Constants for the Knowledge module."""

from __future__ import annotations

from enum import StrEnum

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

MAX_NAME_LENGTH = 255
MAX_DESCRIPTION_LENGTH = 5000


class KnowledgeStatus(StrEnum):
    """Knowledge base status."""

    ACTIVE = "active"
    ARCHIVED = "archived"


class KnowledgeVisibility(StrEnum):
    """Knowledge base visibility."""

    PRIVATE = "private"
    ORGANIZATION = "organization"


DEFAULT_KNOWLEDGE_STATUS = KnowledgeStatus.ACTIVE
DEFAULT_KNOWLEDGE_VISIBILITY = KnowledgeVisibility.PRIVATE

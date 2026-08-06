"""Pagination utilities."""

from __future__ import annotations

from dataclasses import dataclass
from math import ceil

from app.config.constants import (
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
)
from fastapi import Query


@dataclass(slots=True, frozen=True)
class PaginationParams:
    """Pagination parameters."""

    page: int = DEFAULT_PAGE
    page_size: int = DEFAULT_PAGE_SIZE

    @property
    def offset(self) -> int:
        """Return SQL offset.

        Returns:
            Offset for database queries.
        """
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Return SQL limit.

        Returns:
            Limit for database queries.
        """
        return self.page_size


def get_pagination(
    page: int = Query(
        default=DEFAULT_PAGE,
        ge=1,
        description="Page number.",
    ),
    page_size: int = Query(
        default=DEFAULT_PAGE_SIZE,
        ge=1,
        le=MAX_PAGE_SIZE,
        description="Items per page.",
    ),
) -> PaginationParams:
    """Return validated pagination parameters.

    Args:
        page: Requested page number.
        page_size: Requested page size.

    Returns:
        Pagination parameters.
    """
    return PaginationParams(
        page=page,
        page_size=page_size,
    )


def calculate_total_pages(
    total_records: int,
    page_size: int,
) -> int:
    """Calculate the total number of pages.

    Args:
        total_records: Total records available.
        page_size: Number of records per page.

    Returns:
        Total page count.
    """
    if total_records == 0:
        return 0

    return ceil(total_records / page_size)

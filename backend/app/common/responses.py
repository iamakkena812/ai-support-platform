"""Standard API response models."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ResponseMetadata(BaseModel):
    """Metadata included with API responses."""

    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    request_id: str | None = None


class SuccessResponse[T](BaseModel):
    """Standard success response."""

    success: bool = True
    message: str
    data: T
    metadata: ResponseMetadata = Field(default_factory=ResponseMetadata)


class ErrorResponse(BaseModel):
    """Standard error response."""

    success: bool = False
    message: str
    error_code: str | None = None
    details: dict[str, Any] | None = None
    metadata: ResponseMetadata = Field(default_factory=ResponseMetadata)


class PaginationMetadata(BaseModel):
    """Pagination information."""

    page: int
    page_size: int
    total_records: int
    total_pages: int


class PaginatedResponse[T](BaseModel):
    """Standard paginated response."""

    success: bool = True
    message: str
    data: list[T]
    pagination: PaginationMetadata
    metadata: ResponseMetadata = Field(default_factory=ResponseMetadata)

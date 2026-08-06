"""File management module."""

from __future__ import annotations

from app.files.repository import FileRepository
from app.files.router import router
from app.files.service import FileService

__all__ = [
    "FileRepository",
    "FileService",
    "router",
]

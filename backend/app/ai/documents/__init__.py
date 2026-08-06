"""AI Documents module."""

from __future__ import annotations

from app.ai.documents.models import Document
from app.ai.documents.repository import DocumentRepository
from app.ai.documents.router import router
from app.ai.documents.service import DocumentService

__all__ = [
    "Document",
    "DocumentRepository",
    "DocumentService",
    "router",
]

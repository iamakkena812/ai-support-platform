"""Providers for the audit module."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.audit.models import AuditLog


class AuditProvider(ABC):
    """Base provider for audit logging."""

    @abstractmethod
    def publish(
        self,
        audit_log: AuditLog,
    ) -> None:
        """Publish an audit log."""


class NoOpAuditProvider(AuditProvider):
    """Default provider that performs no external publishing."""

    def publish(
        self,
        audit_log: AuditLog,
    ) -> None:
        """Publish an audit log."""
        return

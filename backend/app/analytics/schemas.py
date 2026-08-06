"""Schemas for analytics."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    """Dashboard summary."""

    organizations: int
    users: int
    projects: int
    tickets: int
    open_tickets: int
    closed_tickets: int
    sla_breaches: int
    workflows: int


class TicketMetrics(BaseModel):
    """Ticket metrics."""

    total: int
    open: int
    pending: int
    resolved: int
    closed: int


class UserMetrics(BaseModel):
    """User metrics."""

    total: int
    active: int
    inactive: int


class OrganizationMetrics(BaseModel):
    """Organization metrics."""

    total: int
    active: int


class WorkflowMetrics(BaseModel):
    """Workflow metrics."""

    total: int
    active: int
    inactive: int


class SLAMetrics(BaseModel):
    """SLA metrics."""

    policies: int
    breaches: int
    compliance_percentage: float


class ReportFilter(BaseModel):
    """Analytics report filter."""

    organization_id: str | None = None

    start_date: date | None = None

    end_date: date | None = None

    include_deleted: bool = False


class AnalyticsHealth(BaseModel):
    """Analytics health."""

    database: bool = True

    reports: bool = True

    dashboard: bool = True

    metrics: bool = True

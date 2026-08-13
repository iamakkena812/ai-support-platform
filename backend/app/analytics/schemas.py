"""Schemas for analytics."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase."""
    first, *rest = string.split("_")
    return first + "".join(word.capitalize() for word in rest)


class CamelModel(BaseModel):
    """Base model using camelCase JSON aliases."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class TicketMetrics(CamelModel):
    """Ticket metrics for an organization."""

    total: int

    by_status: dict[str, int]

    by_priority: dict[str, int]


class UserMetrics(CamelModel):
    """User metrics for an organization."""

    total: int

    active: int

    inactive: int


class OrganizationMetrics(CamelModel):
    """Platform-wide organization metrics."""

    total: int

    active: int


class WorkflowMetrics(CamelModel):
    """Workflow metrics for an organization."""

    total: int

    active: int

    inactive: int


class SLAMetrics(CamelModel):
    """SLA metrics for an organization."""

    policies: int

    breaches: int

    compliance_percentage: float


class DashboardSummary(CamelModel):
    """Organization-scoped analytics dashboard summary."""

    users: int

    active_users: int

    projects: int

    tickets: TicketMetrics

    workflows: WorkflowMetrics

    sla: SLAMetrics

    start_date: date | None = None

    end_date: date | None = None


class AnalyticsHealth(CamelModel):
    """Analytics module health."""

    database: bool = True

    dashboard: bool = True

    metrics: bool = True

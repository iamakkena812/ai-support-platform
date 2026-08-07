"""Dashboard schemas."""

from __future__ import annotations

from datetime import datetime

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


class DashboardStatistics(CamelModel):
    """Dashboard statistics."""

    total_organizations: int

    total_users: int

    total_customers: int

    total_projects: int

    total_tickets: int

    total_attachments: int

    total_notifications: int

    open_tickets: int

    closed_tickets: int

    high_priority_tickets: int


class DashboardTicket(CamelModel):
    """Recent ticket."""

    id: str

    ticket_number: str

    title: str

    status: str

    priority: str

    created_at: datetime


class DashboardCustomer(CamelModel):
    """Recent customer."""

    id: str

    name: str

    email: str

    company: str

    created_at: datetime


class DashboardProject(CamelModel):
    """Recent project."""

    id: str

    name: str

    status: str

    progress: int

    start_date: datetime | None = None

    end_date: datetime | None = None


class DashboardNotification(CamelModel):
    """Recent notification."""

    id: str

    title: str

    type: str

    is_read: bool

    created_at: datetime


class SystemHealth(CamelModel):
    """System health."""

    status: str

    api: bool

    database: bool

    ai_services: bool

    storage: bool

    updated_at: datetime


class AIInsight(CamelModel):
    """AI generated insight."""

    id: str

    title: str

    description: str

    severity: str

    generated_at: datetime


class DashboardResponse(CamelModel):
    """Dashboard response."""

    statistics: DashboardStatistics

    recent_tickets: list[DashboardTicket]

    recent_customers: list[DashboardCustomer]

    recent_projects: list[DashboardProject]

    recent_notifications: list[DashboardNotification]

    system_health: SystemHealth

    ai_insights: list[AIInsight]

"""Dashboard service."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.customers.models import Customer
from app.dashboard.schemas import (
    DashboardResponse,
    DashboardStatistics,
    SystemHealth,
)
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


class DashboardService:
    """Dashboard service."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize dashboard service."""
        self._session = session

    def get_dashboard(
        self,
    ) -> DashboardResponse:
        """Return dashboard statistics."""
        total_tickets = (
            self._session.scalar(
                select(func.count(Ticket.id)),
            )
            or 0
        )

        open_tickets = (
            self._session.scalar(
                select(func.count(Ticket.id)).where(
                    Ticket.status == "open",
                ),
            )
            or 0
        )

        closed_tickets = (
            self._session.scalar(
                select(func.count(Ticket.id)).where(
                    Ticket.status == "closed",
                ),
            )
            or 0
        )

        customers = (
            self._session.scalar(
                select(func.count(Customer.id)),
            )
            or 0
        )

        organizations = (
            self._session.scalar(
                select(func.count(Organization.id)),
            )
            or 0
        )

        users = (
            self._session.scalar(
                select(func.count(User.id)),
            )
            or 0
        )

        return DashboardResponse(
            statistics=DashboardStatistics(
                total_organizations=organizations,
                total_users=users,
                total_customers=customers,
                total_projects=0,
                total_tickets=total_tickets,
                total_attachments=0,
                total_notifications=0,
                open_tickets=open_tickets,
                closed_tickets=closed_tickets,
                high_priority_tickets=0,
            ),
            recent_tickets=[],
            recent_customers=[],
            recent_projects=[],
            recent_notifications=[],
            system_health=SystemHealth(
                status="healthy",
                api=True,
                database=True,
                ai_services=True,
                storage=True,
                updated_at=datetime.now(UTC),
            ),
            ai_insights=[],
        )

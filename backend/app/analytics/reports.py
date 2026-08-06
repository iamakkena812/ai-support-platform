"""Analytics report generation."""

from __future__ import annotations

from app.analytics.repository import AnalyticsRepository
from app.analytics.schemas import ReportFilter


class ReportsManager:
    """Manager for analytics reports."""

    def __init__(
        self,
        repository: AnalyticsRepository,
    ) -> None:
        """Initialize reports manager."""
        self._repository = repository

    def generate_ticket_report(
        self,
        report_filter: ReportFilter,
    ) -> dict[str, int]:
        """Generate ticket report."""
        return {
            "tickets": self._repository.count_tickets(),
            "open": self._repository.count_open_tickets(),
            "pending": self._repository.count_pending_tickets(),
            "resolved": self._repository.count_resolved_tickets(),
            "closed": self._repository.count_closed_tickets(),
        }

    def generate_sla_report(
        self,
        report_filter: ReportFilter,
    ) -> dict[str, int]:
        """Generate SLA report."""
        return {
            "policies": self._repository.count_sla_policies(),
            "breaches": self._repository.count_sla_breaches(),
        }

    def generate_dashboard_report(
        self,
    ) -> dict[str, int]:
        """Generate dashboard report."""
        return {
            "organizations": self._repository.count_organizations(),
            "users": self._repository.count_users(),
            "projects": self._repository.count_projects(),
            "tickets": self._repository.count_tickets(),
            "workflows": self._repository.count_workflows(),
        }

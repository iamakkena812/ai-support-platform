"""Dashboard business logic."""

from __future__ import annotations

from app.analytics.repository import AnalyticsRepository
from app.analytics.schemas import DashboardSummary


class DashboardManager:
    """Manager for dashboard analytics."""

    def __init__(
        self,
        repository: AnalyticsRepository,
    ) -> None:
        """Initialize dashboard manager."""
        self._repository = repository

    def build_dashboard(self) -> DashboardSummary:
        """Build dashboard summary."""
        return DashboardSummary(
            organizations=self._repository.count_organizations(),
            users=self._repository.count_users(),
            projects=self._repository.count_projects(),
            tickets=self._repository.count_tickets(),
            open_tickets=self._repository.count_open_tickets(),
            closed_tickets=self._repository.count_closed_tickets(),
            sla_breaches=self._repository.count_sla_breaches(),
            workflows=self._repository.count_workflows(),
        )

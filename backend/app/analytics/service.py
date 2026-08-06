"""Service for analytics."""

from __future__ import annotations

from app.analytics.repository import AnalyticsRepository
from app.analytics.schemas import (
    AnalyticsHealth,
    DashboardSummary,
    OrganizationMetrics,
    SLAMetrics,
    TicketMetrics,
    UserMetrics,
    WorkflowMetrics,
)


class AnalyticsService:
    """Service providing analytics."""

    def __init__(
        self,
        repository: AnalyticsRepository,
    ) -> None:
        """Initialize analytics service.

        Args:
            repository: Analytics repository.
        """
        self._repository = repository

    def get_dashboard(self) -> DashboardSummary:
        """Return dashboard summary."""
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

    def get_ticket_metrics(self) -> TicketMetrics:
        """Return ticket metrics."""
        return TicketMetrics(
            total=self._repository.count_tickets(),
            open=self._repository.count_open_tickets(),
            pending=self._repository.count_pending_tickets(),
            resolved=self._repository.count_resolved_tickets(),
            closed=self._repository.count_closed_tickets(),
        )

    def get_user_metrics(self) -> UserMetrics:
        """Return user metrics."""
        total = self._repository.count_users()
        active = self._repository.count_active_users()

        return UserMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def get_organization_metrics(
        self,
    ) -> OrganizationMetrics:
        """Return organization metrics."""
        total = self._repository.count_organizations()
        active = self._repository.count_active_organizations()

        return OrganizationMetrics(
            total=total,
            active=active,
        )

    def get_workflow_metrics(self) -> WorkflowMetrics:
        """Return workflow metrics."""
        total = self._repository.count_workflows()
        active = self._repository.count_active_workflows()

        return WorkflowMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def get_sla_metrics(self) -> SLAMetrics:
        """Return SLA metrics."""
        policies = self._repository.count_sla_policies()
        breaches = self._repository.count_sla_breaches()

        compliance = (
            100.0
            if policies == 0
            else max(0.0, ((policies - breaches) / policies) * 100)
        )

        return SLAMetrics(
            policies=policies,
            breaches=breaches,
            compliance_percentage=round(compliance, 2),
        )

    def get_health(self) -> AnalyticsHealth:
        """Return analytics health."""
        return AnalyticsHealth()

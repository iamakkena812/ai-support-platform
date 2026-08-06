"""Analytics metric calculations."""

from __future__ import annotations

from app.analytics.repository import AnalyticsRepository
from app.analytics.schemas import (
    OrganizationMetrics,
    SLAMetrics,
    TicketMetrics,
    UserMetrics,
    WorkflowMetrics,
)


class MetricsManager:
    """Manager for analytics metrics."""

    def __init__(
        self,
        repository: AnalyticsRepository,
    ) -> None:
        """Initialize metrics manager."""
        self._repository = repository

    def ticket_metrics(self) -> TicketMetrics:
        """Return ticket metrics."""
        return TicketMetrics(
            total=self._repository.count_tickets(),
            open=self._repository.count_open_tickets(),
            pending=self._repository.count_pending_tickets(),
            resolved=self._repository.count_resolved_tickets(),
            closed=self._repository.count_closed_tickets(),
        )

    def user_metrics(self) -> UserMetrics:
        """Return user metrics."""
        total = self._repository.count_users()
        active = self._repository.count_active_users()

        return UserMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def organization_metrics(
        self,
    ) -> OrganizationMetrics:
        """Return organization metrics."""
        total = self._repository.count_organizations()
        active = self._repository.count_active_organizations()

        return OrganizationMetrics(
            total=total,
            active=active,
        )

    def workflow_metrics(self) -> WorkflowMetrics:
        """Return workflow metrics."""
        total = self._repository.count_workflows()
        active = self._repository.count_active_workflows()

        return WorkflowMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def sla_metrics(self) -> SLAMetrics:
        """Return SLA metrics."""
        policies = self._repository.count_sla_policies()
        breaches = self._repository.count_sla_breaches()

        compliance = (
            100.0
            if policies == 0
            else max(
                0.0,
                ((policies - breaches) / policies) * 100,
            )
        )

        return SLAMetrics(
            policies=policies,
            breaches=breaches,
            compliance_percentage=round(compliance, 2),
        )

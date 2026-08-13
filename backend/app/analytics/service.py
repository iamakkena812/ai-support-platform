"""Service for analytics."""

from __future__ import annotations

from datetime import date
from uuid import UUID

from app.analytics.exceptions import InvalidDateRangeError
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
    """Service providing organization-scoped analytics."""

    def __init__(
        self,
        repository: AnalyticsRepository,
    ) -> None:
        """Initialize analytics service.

        Args:
            repository: Analytics repository.
        """
        self._repository = repository

    @staticmethod
    def _validate_date_range(
        start_date: date | None,
        end_date: date | None,
    ) -> None:
        """Raise if the supplied date range is invalid."""
        if start_date is not None and end_date is not None and start_date > end_date:
            raise InvalidDateRangeError()

    def get_ticket_metrics(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> TicketMetrics:
        """Return ticket metrics for an organization."""
        self._validate_date_range(start_date, end_date)

        return TicketMetrics(
            total=self._repository.count_tickets(
                organization_id,
                start_date=start_date,
                end_date=end_date,
            ),
            by_status=self._repository.tickets_by_status(
                organization_id,
                start_date=start_date,
                end_date=end_date,
            ),
            by_priority=self._repository.tickets_by_priority(
                organization_id,
                start_date=start_date,
                end_date=end_date,
            ),
        )

    def get_user_metrics(
        self,
        organization_id: UUID,
    ) -> UserMetrics:
        """Return user metrics for an organization."""
        total = self._repository.count_users(organization_id)
        active = self._repository.count_active_users(organization_id)

        return UserMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def get_organization_metrics(
        self,
    ) -> OrganizationMetrics:
        """Return platform-wide organization metrics."""
        total = self._repository.count_organizations()
        active = self._repository.count_active_organizations()

        return OrganizationMetrics(
            total=total,
            active=active,
        )

    def get_workflow_metrics(
        self,
        organization_id: UUID,
    ) -> WorkflowMetrics:
        """Return workflow metrics for an organization."""
        total = self._repository.count_workflows(organization_id)
        active = self._repository.count_active_workflows(organization_id)

        return WorkflowMetrics(
            total=total,
            active=active,
            inactive=total - active,
        )

    def get_sla_metrics(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> SLAMetrics:
        """Return SLA metrics for an organization."""
        self._validate_date_range(start_date, end_date)

        policies = self._repository.count_sla_policies(organization_id)
        breaches = self._repository.count_sla_breaches(
            organization_id,
            start_date=start_date,
            end_date=end_date,
        )

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

    def get_dashboard(
        self,
        organization_id: UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> DashboardSummary:
        """Return organization-scoped dashboard summary."""
        self._validate_date_range(start_date, end_date)

        return DashboardSummary(
            users=self._repository.count_users(organization_id),
            active_users=self._repository.count_active_users(organization_id),
            projects=self._repository.count_projects(organization_id),
            tickets=self.get_ticket_metrics(
                organization_id,
                start_date=start_date,
                end_date=end_date,
            ),
            workflows=self.get_workflow_metrics(organization_id),
            sla=self.get_sla_metrics(
                organization_id,
                start_date=start_date,
                end_date=end_date,
            ),
            start_date=start_date,
            end_date=end_date,
        )

    def get_health(self) -> AnalyticsHealth:
        """Return analytics health."""
        return AnalyticsHealth()
